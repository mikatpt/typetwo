package app

import (
	"encoding/json"
	"fmt"
	"html"
	"net/http"

	"github.com/mikatpt/typetwo/database"
)

func GetInfo(email string) {

}

func (a *App) GetFromDatabase(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query()["email"][0]
	token := r.URL.Query()["token"][0] // use token to validate requests.
	_ = token

	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case "GET":
		s := database.Stats{}
		err := s.GetInfo(a.Database, email)

		HandleError(w, err, http.StatusBadRequest, "Something went wrong in GETting info!")

		w.WriteHeader(200)
		json.NewEncoder(w).Encode(s)
	}
}

func Root(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, %q", html.EscapeString(r.URL.Path))
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hi")
}
