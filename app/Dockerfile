FROM golang:1.26-alpine AS builder

RUN addgroup -g 1000 appgroup && adduser -u 1000 -G appgroup -S appuser

WORKDIR /app

COPY app/go.mod ./

RUN go mod download

COPY app/ .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/server .

FROM scratch

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

WORKDIR /app

COPY --from=builder /app/server /app/server

ENV PORT=3000

USER appuser

EXPOSE 3000

ENTRYPOINT ["/app/server"]
