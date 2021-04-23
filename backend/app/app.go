package app

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/mikatpt/typetwo/database"
)

type App struct {
	Router *mux.Router
	DB     *sql.DB
}

func (a *App) Initialize(user, password, dbname string) {

	a.DB = database.Initialize(user, password, dbname)
	a.Router = mux.NewRouter()

	a.initRoutes()
}

func (a *App) initRoutes() {
	router := a.Router
	router.HandleFunc("/", Root).Methods("GET", "OPTIONS")
	router.HandleFunc("/hi", HelloWorld).Methods("GET", "OPTIONS")
	router.HandleFunc("/db", a.GetFromDatabase).Methods("GET", "POST", "UPDATE", "DELETE", "OPTIONS")
}

func (a *App) HandleCORS() func(http.Handler) http.Handler {
	return handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedOrigins([]string{"http://localhost:3000", "*"}),
	)
}

func CheckErrors(err error) {
	if err != nil {
		panic(err)
	}
}

func HandleError(w http.ResponseWriter, err error, status int, message string) {
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(status)
	w.Write([]byte(message))
}
