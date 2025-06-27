# Thompson Chain Reference Bible API Documentation

A RESTful API for accessing Thompson Chain Reference Bible data, including verses, chain references, and search functionality.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "data": {...},
  "error": "Error message (if success is false)",
  "message": "Additional information"
}
```

## Endpoints

### 1. API Information

Get information about the API and available endpoints.

**GET** `/api`

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Thompson Chain Reference Bible API",
    "version": "1.0.0",
    "description": "RESTful API for Thompson Chain Reference Bible data",
    "endpoints": {
      "books": "/api/books",
      "search": "/api/search?q={query}",
      "chains": "/api/chains",
      "chain": "/api/chains/{id}",
      "verse": "/api/verse/{book}/{chapter}/{verse}",
      "chapter": "/api/chapter/{book}/{chapter}"
    }
  }
}
```

### 2. Bible Books

Get a list of all available Bible books.

**GET** `/api/books`

**Response:**
```json
{
  "success": true,
  "data": [
    "Genesis",
    "Exodus",
    "Leviticus",
    ...
  ],
  "count": 66
}
```

### 3. Get Specific Verse

Retrieve a specific Bible verse.

**GET** `/api/verse/{book}/{chapter}/{verse}`

**Parameters:**
- `book` (string): Bible book name (e.g., "John", "Genesis")
- `chapter` (integer): Chapter number
- `verse` (integer): Verse number

**Example:** `/api/verse/John/3/16`

**Response:**
```json
{
  "success": true,
  "data": {
    "reference": "John 3:16",
    "book": "John",
    "chapter": 3,
    "verse": 16,
    "text": "For God so loved the world, that he gave his only begotten Son..."
  }
}
```

### 4. Get Chapter

Retrieve all verses from a specific chapter.

**GET** `/api/chapter/{book}/{chapter}`

**Parameters:**
- `book` (string): Bible book name
- `chapter` (integer): Chapter number

**Example:** `/api/chapter/John/3`

**Response:**
```json
{
  "success": true,
  "data": {
    "book": "John",
    "chapter": 3,
    "verses": [
      {
        "verse": 1,
        "text": "There was a man of the Pharisees...",
        "reference": "John 3:1"
      },
      {
        "verse": 2,
        "text": "The same came to Jesus by night...",
        "reference": "John 3:2"
      }
    ]
  }
}
```

### 5. Search Bible

Search for verses containing specific text.

**GET** `/api/search?q={query}&limit={limit}`

**Query Parameters:**
- `q` (string, required): Search query
- `limit` (integer, optional): Maximum number of results (default: 50)

**Example:** `/api/search?q=love&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "reference": "John 3:16",
      "book": "John",
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world...",
      "relevance": 15
    }
  ],
  "query": "love",
  "total": 25,
  "returned": 10
}
```

### 6. Get All Chains

Retrieve a list of all available chain references.

**GET** `/api/chains`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "God's Love",
      "description": "The love of God demonstrated throughout Scripture",
      "verseCount": 4
    },
    {
      "id": 2,
      "title": "Faith",
      "description": "Biblical teaching on faith and trust in God",
      "verseCount": 3
    }
  ],
  "count": 2
}
```

### 7. Get Specific Chain

Retrieve detailed information about a specific chain reference.

**GET** `/api/chains/{id}`

**Parameters:**
- `id` (integer): Chain ID

**Example:** `/api/chains/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "God's Love",
    "description": "The love of God demonstrated throughout Scripture",
    "verses": [
      {
        "reference": "John 3:16",
        "text": "For God so loved the world..."
      },
      {
        "reference": "Romans 5:8",
        "text": "But God demonstrates his own love for us..."
      }
    ]
  }
}
```

### 8. Search Chains

Search for chain references by title, description, or verse content.

**GET** `/api/chains/search?q={query}`

**Query Parameters:**
- `q` (string, required): Search query

**Example:** `/api/chains/search?q=love`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "God's Love",
      "description": "The love of God demonstrated throughout Scripture",
      "matchType": "title"
    }
  ],
  "query": "love",
  "count": 1
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Query parameter required",
  "message": "Use ?q=your_search_term"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Verse not found",
  "message": "John 3:999 not available in database"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Usage Examples

### JavaScript (Fetch API)

```javascript
// Get all books
fetch('http://localhost:3001/api/books')
  .then(response => response.json())
  .then(data => console.log(data.data));

// Search for verses
fetch('http://localhost:3001/api/search?q=love')
  .then(response => response.json())
  .then(data => console.log(data.data));

// Get specific verse
fetch('http://localhost:3001/api/verse/John/3/16')
  .then(response => response.json())
  .then(data => console.log(data.data));
```

### Python (requests)

```python
import requests

# Get all chains
response = requests.get('http://localhost:3001/api/chains')
chains = response.json()['data']

# Search Bible
response = requests.get('http://localhost:3001/api/search', params={'q': 'faith'})
results = response.json()['data']
```

### cURL

```bash
# Get API info
curl http://localhost:3001/api

# Search for verses
curl "http://localhost:3001/api/search?q=love&limit=5"

# Get specific chain
curl http://localhost:3001/api/chains/1
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all origins. In production, configure CORS to allow only specific domains.

## Installation and Setup

1. Navigate to the API directory:
   ```bash
   cd thompson-chain-bible/api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. The API will be available at `http://localhost:3001`

## Development

For development with auto-restart:
```bash
npm run dev
```

## Future Enhancements

- [ ] Authentication and authorization
- [ ] Rate limiting
- [ ] Database integration
- [ ] Caching layer
- [ ] API versioning
- [ ] OpenAPI/Swagger documentation
- [ ] Pagination for large result sets
- [ ] Advanced search filters
- [ ] Bulk operations
- [ ] WebSocket support for real-time updates
