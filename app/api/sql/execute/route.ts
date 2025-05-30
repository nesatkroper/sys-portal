import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { query, database } = await request.json()

  // Enhanced mock results based on query type
  let mockResults

  if (query.toLowerCase().includes("select * from users")) {
    mockResults = {
      columns: ["id", "username", "email", "first_name", "last_name", "created_at", "last_login", "is_active"],
      rows: [
        [1, "john_doe", "john@example.com", "John", "Doe", "2024-01-15 10:30:00", "2024-01-30 14:22:15", true],
        [2, "jane_smith", "jane@example.com", "Jane", "Smith", "2024-01-16 09:15:00", "2024-01-30 11:45:30", true],
        [3, "bob_johnson", "bob@example.com", "Bob", "Johnson", "2024-01-17 14:20:00", "2024-01-29 16:10:45", true],
        [4, "alice_brown", "alice@example.com", "Alice", "Brown", "2024-01-18 11:45:00", "2024-01-30 09:30:20", false],
        [
          5,
          "charlie_wilson",
          "charlie@example.com",
          "Charlie",
          "Wilson",
          "2024-01-19 16:30:00",
          "2024-01-30 13:15:10",
          true,
        ],
      ],
      rowCount: 5,
      executionTime: "23ms",
      queryType: "SELECT",
    }
  } else if (query.toLowerCase().includes("select * from products")) {
    mockResults = {
      columns: ["id", "name", "price", "category", "stock_quantity", "created_at"],
      rows: [
        [1, "Laptop Pro 15", 1299.99, "Electronics", 45, "2024-01-10 12:00:00"],
        [2, "Wireless Mouse", 29.99, "Electronics", 120, "2024-01-12 14:30:00"],
        [3, "Office Chair", 199.99, "Furniture", 23, "2024-01-15 09:45:00"],
        [4, "Coffee Mug", 12.99, "Kitchen", 89, "2024-01-18 11:20:00"],
        [5, "Notebook Set", 15.99, "Stationery", 67, "2024-01-20 16:15:00"],
      ],
      rowCount: 5,
      executionTime: "18ms",
      queryType: "SELECT",
    }
  } else if (query.toLowerCase().includes("show tables")) {
    mockResults = {
      columns: ["table_name", "table_type", "row_count", "size"],
      rows: [
        ["users", "BASE TABLE", 1247, "2.3 MB"],
        ["products", "BASE TABLE", 892, "1.8 MB"],
        ["orders", "BASE TABLE", 3421, "5.7 MB"],
        ["order_items", "BASE TABLE", 8934, "12.1 MB"],
        ["categories", "BASE TABLE", 45, "128 KB"],
        ["reviews", "BASE TABLE", 2156, "3.2 MB"],
        ["sessions", "BASE TABLE", 567, "890 KB"],
      ],
      rowCount: 7,
      executionTime: "12ms",
      queryType: "SHOW",
    }
  } else {
    mockResults = {
      columns: ["result"],
      rows: [["Query executed successfully"]],
      rowCount: 1,
      executionTime: "45ms",
      queryType: "OTHER",
    }
  }

  // Simulate execution delay
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

  return NextResponse.json(mockResults)
}
