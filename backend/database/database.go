package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

const host = "localhost"
const port = 5432

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

func Initialize(user, password, dbname string) *sql.DB {

	psqlConfig := fmt.Sprintf(
		"host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)
	db, err := sql.Open("postgres", psqlConfig)

	CheckError(err)

	err = db.Ping()
	CheckError(err)

	fmt.Println("Successfully connected to Postgres!")
	return db
}
