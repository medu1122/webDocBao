# Backend Setup Guide

## MongoDB Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/news_portal

# For production, use MongoDB Atlas or other cloud MongoDB service
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/news_portal?retryWrites=true&w=majority
```

### 2. Local MongoDB Setup

#### Option 1: Docker (Recommended)
```bash
# Run MongoDB with Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Or with persistent storage
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest
```

#### Option 2: MongoDB Community Server
1. Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service

### 3. Database Collections

The application uses two main collections:

#### Authors Collection
```json
{
  "_id": "author123",
  "name": "Nguyễn Văn A",
  "email": "vana@baomoi.vn",
  "avatar": "https://yourcdn.com/avatar.jpg",
  "bio": "Phóng viên chuyên mục giao thông",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

#### Articles Collection
```json
{
  "_id": "688c90e21aabe3ce2413764b",
  "title": "3 tuyến xe thay thế buýt 150 cho người dân Đồng Nai đi TP.HCM",
  "slug": "3-tuyen-xe-thay-the-buyt-150",
  "summary": "Người dân mong muốn giữ nguyên lộ trình cũ...",
  "category": "giao-thong",
  "tags": ["TP.HCM", "Đồng Nai", "xe buýt"],
  "coverImage": "https://yourcdn.com/image1.jpg",
  "author_id": "author123",
  "content_blocks": [
    {
      "type": "text",
      "data": "Người dân mong muốn giữ nguyên lộ trình tuyến buýt..."
    },
    {
      "type": "image",
      "data": {
        "url": "https://yourcdn.com/image2.jpg",
        "caption": "Xe buýt tuyến 150 trước đây"
      }
    }
  ],
  "created_at": "2025-08-01T10:30:00.000Z",
  "updated_at": "2025-08-01T10:30:00.000Z",
  "status": "published"
}
```

## API Endpoints

### Authors API

- `GET /api/authors` - Get all authors
- `POST /api/authors` - Create a new author
- `GET /api/authors/[id]` - Get a specific author
- `PUT /api/authors/[id]` - Update a specific author
- `DELETE /api/authors/[id]` - Delete a specific author

### Articles API

- `GET /api/articles` - Get all articles (with pagination and filtering)
- `POST /api/articles` - Create a new article
- `GET /api/articles/[id]` - Get a specific article
- `PUT /api/articles/[id]` - Update a specific article
- `DELETE /api/articles/[id]` - Delete a specific article

#### Query Parameters for Articles
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `status` - Filter by status (draft, published, archived)
- `search` - Search in title, summary, and tags

## Usage Examples

### Create an Author
```bash
curl -X POST http://localhost:9002/api/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "vana@baomoi.vn",
    "avatar": "https://yourcdn.com/avatar.jpg",
    "bio": "Phóng viên chuyên mục giao thông"
  }'
```

### Create an Article
```bash
curl -X POST http://localhost:9002/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "3 tuyến xe thay thế buýt 150 cho người dân Đồng Nai đi TP.HCM",
    "slug": "3-tuyen-xe-thay-the-buyt-150",
    "summary": "Người dân mong muốn giữ nguyên lộ trình cũ...",
    "category": "giao-thong",
    "tags": ["TP.HCM", "Đồng Nai", "xe buýt"],
    "coverImage": "https://yourcdn.com/image1.jpg",
    "author_id": "author123",
    "content_blocks": [
      {
        "type": "text",
        "data": "Người dân mong muốn giữ nguyên lộ trình tuyến buýt..."
      }
    ],
    "status": "published"
  }'
```

### Get Articles with Filtering
```bash
curl "http://localhost:9002/api/articles?category=giao-thong&status=published&page=1&limit=5"
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:9002/api/` 