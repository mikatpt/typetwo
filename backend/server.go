package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/mikatpt/typetwo/app"
)

func main() {
	_ = godotenv.Load("../.env.local")

	a := new(app.App)

	a.Initialize(os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_NAME"))

	corsSetup := a.HandleCORS()

	fmt.Println("Listening at http://localhost:5001")
	log.Fatal(http.ListenAndServe(":5001", corsSetup(a.Router)))
}
