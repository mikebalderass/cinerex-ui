export type MovieType = {
    movieId: string;
    title: string;
    description: string;
    duration: number;
    rating: string;
    poster?: string | null;
    functions?: FunctionType[];
}


export type FunctionType = {
    functionId: string;
    movieId: string;
    theaterId: string;
    datetime: Date;
    seats?: SeatType[];
    tickets?: TicketType[];
}


export type SeatType = {
    seatId: string;
    functionId: string;
    row_letter: string;
    seat_number: number;
    status: "AVAILABLE" | "SOLD";
}

export type TicketType = {
    ticketId: string;
    functionId: string;
    userName: string;
    purchaseDate: Date;
    seats: { row_letter: string; seat_number: number }[];
}

export type TheaterType = {
    theaterId: string;
    theaterNumber: string;
    functions?: FunctionType[];
}

export const dataExample = {
  movies: [
    {
      movieId: "mov-001",
      title: "Invasión Galáctica",
      description: "Una épica batalla entre civilizaciones interplanetarias.",
      duration: 142,
      rating: "PG-13",
      poster: "https://example.com/posters/invasion.jpg",
      functions: [
        {
          functionId: "fun-101",
          movieId: "mov-001",
          theaterId: "theater-01",
          datetime: new Date("2025-06-01T18:30:00.000Z"),
          seats: [
            {
              seatId: "seat-001",
              functionId: "fun-101",
              row_letter: "A",
              seat_number: 1,
              status: "AVAILABLE"
            },
            {
              seatId: "seat-002",
              functionId: "fun-101",
              row_letter: "A",
              seat_number: 2,
              status: "SOLD"
            }
          ],
          tickets: [
            {
              ticketId: "tick-001",
              functionId: "fun-101",
              userName: "juan.perez",
              purchaseDate: new Date("2025-05-30T14:00:00.000Z"),
              seats: [
                {
                  row_letter: "A",
                  seat_number: 2
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  theaters: [
    {
      theaterId: "theater-01",
      theaterNumber: "1",
      functions: [
        {
          functionId: "fun-101",
          movieId: "mov-001",
          theaterId: "theater-01",
          datetime: new Date("2025-06-01T18:30:00.000Z"),
          seats: [
            {
              seatId: "seat-001",
              functionId: "fun-101",
              row_letter: "A",
              seat_number: 1,
              status: "AVAILABLE"
            },
            {
              seatId: "seat-002",
              functionId: "fun-101",
              row_letter: "A",
              seat_number: 2,
              status: "SOLD"
            }
          ],
          tickets: [
            {
              ticketId: "tick-001",
              functionId: "fun-101",
              userName: "juan.perez",
              purchaseDate: new Date("2025-05-30T14:00:00.000Z"),
              seats: [
                {
                  row_letter: "A",
                  seat_number: 2
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
