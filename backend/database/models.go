package database

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"

	"github.com/lib/pq"
)

type Stats struct {
	Totalchars   float32         `json:"totalchars"`
	Fastestwpm   float32         `json:"fastestwpm"`
	Lastwpm      float32         `json:"lastwpm"`
	Lastaccuracy float32         `json:"lastaccuracy"`
	Totaltime    int             `json:"totaltime"`
	Lasterrors   int             `json:"lasterrors"`
	LastFifths   []int64         `json:"lastfifths"`
	Singles      json.RawMessage `json:"singles"`
	Doubles      json.RawMessage `json:"doubles"`
	Errors       json.RawMessage `json:"errors"`
	Data         json.RawMessage `json:"data"`
	Words        string          `json:"words"`
	ID           string          `json:"id"`
}

type Metrics map[string]interface{}

func (m *Metrics) Value() (driver.Value, error) {
	return json.Marshal(m)
}

func (m *Metrics) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		panic("Type assertion to []byte failed")
	}

	return json.Unmarshal(b, &m)
}

func (s *Stats) GetInfo(db *sql.DB, email string) error {
	query := `SELECT m.totalchars, m.totaltime, m.fastestwpm, m.lastwpm, m.lasterrors,
	m.lastaccuracy, m.fifths, m.singles, m.doubles
	FROM metrics AS m
	LEFT JOIN users
	ON m.user_id = users.id
	WHERE users.id = (SELECT id FROM users WHERE email = $1);
	`

	err := db.QueryRow(query, email).Scan(&s.Totalchars, &s.Totaltime, &s.Fastestwpm, &s.Lastwpm, &s.Lasterrors, &s.Lastaccuracy, pq.Array(&s.LastFifths), &s.Singles, &s.Doubles)

	// t, ok := s.Singles["h"].(map[string]interface{})
	// if !ok {
	// 	fmt.Println("Unexpected type for singles :(")
	// }

	return err
}

func (s *Stats) InsertInfo(db *sql.DB, email string) error {
	query := `INSERT INTO metrics
	(user_id, totalchars, totaltime, fastestWPM, lastWPM, lastErrors, lastAccuracy, fifths, singles, doubles)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	ON CONFLICT (user_id)
	DO UPDATE
	SET totalchars = excluded.totalchars,
	totaltime = excluded.totaltime,
	fastestWPM = excluded.fastestWPM,
	lastWPM = excluded.lastWPM,
	lastErrors = excluded.lastErrors,
	lastAccuracy = excluded.lastAccuracy,
	fifths = excluded.fifths,
	singles = excluded.singles,
	doubles = excluded.doubles
	RETURNING lastWPM;`

	err := db.QueryRow(query, 5, s.Totalchars, s.Totaltime, s.Fastestwpm, s.Lastwpm, s.Lasterrors, s.Lastaccuracy, pq.Array(s.LastFifths), s.Singles, s.Doubles).Scan(&s.Lastwpm)

	return err
}

func Validate(db *sql.DB, token string, email string) bool {
	query := `
	SELECT email
	FROM users
	WHERE id = (SELECT user_id FROM sessions WHERE access_token = $1);`
	var expectedEmail string

	err := db.QueryRow(query, token).Scan(&expectedEmail)

	if err != nil || expectedEmail != email {
		return false
	}

	return true
}
