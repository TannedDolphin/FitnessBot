# AI Fitness Coach Chatbot

## Giới thiệu

AI Fitness Coach Chatbot là hệ thống hỗ trợ tập luyện và dinh dưỡng cá nhân hóa ứng dụng Trí tuệ Nhân tạo (AI).

Hệ thống cho phép người dùng cung cấp thông tin thể trạng cá nhân, từ đó AI sẽ tạo ra kế hoạch tập luyện (Workout Plan) và kế hoạch dinh dưỡng (Nutrition Plan) phù hợp với mục tiêu của từng người dùng. Ngoài ra, người dùng có thể tương tác trực tiếp với chatbot AI để được tư vấn về sức khỏe, tập luyện và dinh dưỡng.

---

## Mục tiêu đề tài

* Xây dựng hệ thống hỗ trợ tập luyện và dinh dưỡng cá nhân hóa.
* Ứng dụng AI vào việc tạo kế hoạch tập luyện và dinh dưỡng.
* Hỗ trợ người dùng xây dựng thói quen tập luyện khoa học.
* Nâng cao trải nghiệm người dùng thông qua chatbot AI.
* Tìm hiểu và ứng dụng các công nghệ Fullstack hiện đại.

---

## Chức năng chính

### Quản lý người dùng

* Đăng ký tài khoản
* Đăng nhập hệ thống
* Mã hóa mật khẩu bằng bcrypt
* Lưu trữ thông tin người dùng

### Quản lý hồ sơ thể chất

Người dùng có thể cung cấp:

* Tuổi
* Cân nặng
* Chiều cao
* Trình độ tập luyện
* Mục tiêu tập luyện
* Chấn thương hoặc hạn chế vận động

### Sinh kế hoạch tập luyện bằng AI

Hệ thống sử dụng AI để tạo:

* Lịch tập từ 3 - 5 ngày
* Danh sách bài tập phù hợp
* Số hiệp (Sets)
* Số lần lặp (Reps)
* Thời gian nghỉ giữa các hiệp

### Sinh kế hoạch dinh dưỡng bằng AI

Hệ thống tạo:

* Lượng calo khuyến nghị mỗi ngày
* Tỷ lệ Protein - Carb - Fat
* Danh sách bữa ăn
* Khung giờ ăn phù hợp

### Chatbot AI Fitness

Người dùng có thể:

* Hỏi đáp về tập luyện
* Hỏi đáp về dinh dưỡng
* Hỏi về kế hoạch đã được tạo
* Nhận tư vấn sức khỏe cơ bản
* Tương tác theo hình thức hội thoại

### Lưu trữ lịch sử kế hoạch

Các kế hoạch được tạo sẽ được lưu vào MongoDB để người dùng có thể xem lại sau này.

---

## Công nghệ sử dụng

### Frontend

* ReactJS
* TypeScript
* Vite
* Tailwind CSS

### Backend

* NodeJS
* ExpressJS

### Database

* MongoDB
* Mongoose

### AI Service

* Cohere API

### Validation

* Zod

### Authentication

* bcryptjs

---

## Kiến trúc hệ thống

```text
Người dùng
     │
     ▼
React Frontend
     │
     ▼
Express Backend
     │
 ┌───┴────┐
 ▼        ▼
Cohere   MongoDB
 AI
```

Luồng xử lý:

1. Người dùng nhập thông tin thể trạng.
2. Frontend gửi dữ liệu đến Backend.
3. Backend kiểm tra dữ liệu bằng Zod.
4. Backend gửi Prompt đến Cohere AI.
5. AI sinh kế hoạch tập luyện và dinh dưỡng.
6. Backend kiểm tra và chuẩn hóa dữ liệu.
7. Lưu dữ liệu vào MongoDB.
8. Trả kết quả về Frontend.

---

## Cấu trúc cơ sở dữ liệu

### User

Lưu thông tin:

* Họ tên
* Email
* Mật khẩu đã mã hóa

### FitnessProfile

Lưu thông tin:

* Tuổi
* Cân nặng
* Chiều cao
* Trình độ tập luyện
* Mục tiêu
* Hạn chế vận động

### Plan

Lưu thông tin:

* Kế hoạch tập luyện
* Kế hoạch dinh dưỡng
* Thông tin AI Model
* Thời gian tạo kế hoạch

---

## API chính

### Người dùng

```http
POST /api/users/register
```

Đăng ký tài khoản.

```http
POST /api/users/login
```

Đăng nhập hệ thống.

```http
GET /api/users/:userId/latest
```

Lấy kế hoạch gần nhất của người dùng.

---

### Chat AI

```http
POST /api/chat
```

Trao đổi với AI Fitness Coach.

---

### Sinh kế hoạch

```http
POST /api/plans/generate
```

Tạo kế hoạch tập luyện và dinh dưỡng bằng AI.

---

### Kiểm tra hệ thống

```http
GET /api/health
```

Kiểm tra trạng thái hoạt động của API.

---

## Hướng dẫn cài đặt

### Clone dự án

```bash
git clone https://github.com/TannedDolphin/FitnessBot.git
```

---

### Cài đặt Backend

```bash
cd fitness-backend
npm install
```

Tạo file `.env`

```env
PORT=5000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Cohere AI
COHERE_API_KEY=your_cohere_api_key
COHERE_MODEL=your_cohere_model

# Frontend URL
CLIENT_ORIGIN=http://localhost:5173

# Gmail SMTP
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASS=your_gmail_app_password
```


Khởi động Backend

```bash
npm run dev
```

---

### Cài đặt Frontend

```bash
cd FE-AI-Fitness-Coach-UI
npm install
npm run dev
```

---

## Kết quả đạt được

* Xây dựng thành công hệ thống Fullstack.
* Tích hợp AI Chatbot hỗ trợ tư vấn fitness.
* Sinh kế hoạch tập luyện cá nhân hóa.
* Sinh kế hoạch dinh dưỡng cá nhân hóa.
* Lưu trữ dữ liệu người dùng trên MongoDB.
* Thiết kế giao diện thân thiện và dễ sử dụng.

---

## Hạn chế

* Chưa triển khai JWT Authentication.
* Chưa có chức năng theo dõi tiến trình tập luyện.
* Chưa hỗ trợ tính BMI và TDEE tự động.
* Chưa triển khai ứng dụng trên nền tảng di động.
* Kết quả AI vẫn phụ thuộc vào mô hình và Prompt hiện tại.

---

## Hướng phát triển

Trong tương lai, hệ thống sẽ được mở rộng với:

* JWT Authentication.
* BMI Calculator.
* BMR/TDEE Calculator.
* Theo dõi cân nặng theo thời gian.
* Dashboard thống kê tiến độ tập luyện.
* Cá nhân hóa sâu hơn bằng AI.
* Triển khai Mobile App.
* Tích hợp hệ thống gợi ý nâng cao.

---
### Cấu hình Gmail App Password

Để sử dụng chức năng gửi email (OTP, quên mật khẩu, thông báo...), cần:

1. Bật xác thực 2 lớp cho tài khoản Gmail.
2. Truy cập Google Account → Security → App Passwords.
3. Tạo App Password mới.
4. Điền thông tin vào file `.env`:

```env
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASS=your_gmail_app_password
```

Lưu ý: Không commit file `.env` lên GitHub để tránh lộ thông tin bảo mật.

```
```

## Thành viên thực hiện

Nguyễn Đức Anh

Đề tài: AI Fitness Coach Chatbot for Personalized Workout and Nutrition Planning.
