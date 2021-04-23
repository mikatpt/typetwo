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

	if !database.Validate(a.DB, token, email) {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(make(map[string]string))
		return
	}

	s := database.Stats{}

	switch r.Method {
	case "GET":
		w.Header().Set("Content-Type", "application/json")

		err := s.GetInfo(a.DB, email)

		if err != nil {
			HandleError(w, err, http.StatusInternalServerError, "Something went wrong in getting info!")
			return
		}

		w.WriteHeader(200)
		json.NewEncoder(w).Encode(&s)

	case "POST":

		json.NewDecoder(r.Body).Decode(&s)

		err := s.InsertInfo(a.DB, email)

		if err != nil {
			HandleError(w, err, http.StatusInternalServerError, "Something went wrong in inserting info!")
			return
		}

		w.Header().Set("Content-Type", "text/plain")
		w.WriteHeader(200)
		w.Write([]byte("Successfully updated information."))
	}
}

func Root(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, %q", html.EscapeString(r.URL.Path))
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hi")
}
