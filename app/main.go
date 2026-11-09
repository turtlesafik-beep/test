package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	// Читаем настройки базы данных из переменных окружения.
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	// Логируем конфигурацию при запуске.
	log.Printf("Application starting...")
	log.Printf("Database host: %s", dbHost)
	log.Printf("Database port: %s", dbPort)

	// Health endpoint.
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "OK")
	})

	// Главная страница.
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprintln(w, "Application is running!")
	})

	// Запускаем HTTP-сервер.
	// 0.0.0.0 означает прослушивание всех сетевых интерфейсов.
	address := "0.0.0.0:3000"

	log.Printf("HTTP server listening on %s", address)

	if err := http.ListenAndServe(address, nil); err != nil {
		log.Fatalf("HTTP server failed: %v", err)
	}
}

