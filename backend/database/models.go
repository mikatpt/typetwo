package database

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"math"

	"github.com/lib/pq"
)

type Stats struct {
	Totalchars   float64 `json:"totalchars"`
	Fastestwpm   float64 `json:"fastestwpm"`
	Lastwpm      float64 `json:"lastwpm"`
	Lastaccuracy float64 `json:"lastaccuracy"`
	Totaltime    int     `json:"totaltime"`
	Lasterrors   int     `json:"lasterrors"`
	Fifths       []int64 `json:"fifths"`
	Singles      Metrics `json:"singles"`
	Doubles      Metrics `json:"doubles"`
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

	err := db.QueryRow(query, email).Scan(&s.Totalchars, &s.Totaltime, &s.Fastestwpm, &s.Lastwpm, &s.Lasterrors, &s.Lastaccuracy, pq.Array(&s.Fifths), &s.Singles, &s.Doubles)

	s.Lastaccuracy = math.Round(s.Lastaccuracy*100) / 100

	// t, ok := s.Singles["h"].(map[string]interface{})
	// if !ok {
	// 	fmt.Println("Unexpected type for singles :(")
	// }

	// tt := t["time"].(float64)

	// fmt.Printf("%v,%T,%v", tt, tt, t["errors"])

	return err
}
