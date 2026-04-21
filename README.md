# YouTube Transcript + RAG Chatbot

An intelligent **Retrieval-Augmented Generation (RAG)** powered chatbot that extracts YouTube video transcripts and enables users to ask natural language questions about the content using **Groq LLM**, **FAISS**, and **Sentence Transformers**.

This project is designed for fast, accurate, and cost-efficient video understanding by sending only the most relevant transcript chunks to the LLM instead of the full transcript.

---

## 🚀 Key Features

### 🎥 YouTube Transcript Extraction
Automatically fetches captions from YouTube videos using `yt-dlp`, supporting both:
- Manual subtitles
- Auto-generated captions

---

### 🧠 Smart RAG Pipeline
Implements a powerful RAG architecture using:
- Text chunking
- Vector embeddings
- FAISS similarity search
- Context-aware response generation

This ensures highly relevant answers with reduced token usage.

---

### ⚡ Groq LLM Integration
Powered by **Groq’s ultra-fast LLM inference**, delivering:
- Faster responses
- Accurate contextual answers
- Better user experience

---

### 💰 Cost Optimization
Instead of sending the full transcript to the LLM:
- Only the top relevant chunks are retrieved
- API token usage is reduced by over **90%**
- Faster and cheaper inference

---

### 🔄 Reliable Fallback System
If Groq becomes unavailable:
- Automatically switches to a Hugging Face model
- Maintains uninterrupted functionality

---

## 🛠️ Tech Stack

- **Frontend:** Streamlit
- **LLM Provider:** Groq API
- **Transcript Extraction:** yt-dlp
- **Embeddings:** Sentence Transformers (`all-MiniLM-L6-v2`)
- **Vector Database:** FAISS
- **Fallback Model:** Hugging Face Transformers

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Prana-labs/Chatbot_agent.git
cd Chatbot_agent
```

---

### 2. Create Virtual Environment

```bash
python -m venv ytenv
```

---

### 3. Activate Virtual Environment

### Windows

```bash
ytenv\Scripts\activate
```

### macOS / Linux

```bash
source ytenv/bin/activate
```

---

### 4. Install Required Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔑 API Setup

### Get Your Groq API Key

1. Visit Groq Console
2. Generate your free API key
3. Add it as an environment variable

### Windows

```bash
set GROQ_API_KEY=your_api_key_here
```

### macOS / Linux

```bash
export GROQ_API_KEY=your_api_key_here
```

You can also provide it directly through the Streamlit sidebar.

---

## ▶️ Running the Application

```bash
streamlit run app.py
```

---

## 🌐 Access the App

After launching:

- Local URL → `http://localhost:8501`
- Network URL → `http://your-ip:8501`

---

## 🎯 How to Use

### Step 1: Paste YouTube URL
Enter any valid YouTube video link.

### Step 2: Extract Transcript
Click **Get Transcript** to fetch video captions.

### Step 3: Ask Questions
Ask anything about the video content like:

- “Summarize this video”
- “What are the main key points?”
- “Explain the conclusion”
- “What did the speaker say about AI?”

### Step 4: Get Smart Answers
The chatbot retrieves the most relevant transcript chunks and generates accurate contextual answers.

---

## 📁 Project Structure

```text
Chatbot_agent/
│
├── app.py
├── main.ipynb
├── requirements.txt
├── README.md
├── .gitignore
└── venv/
```

---

## ⚙️ How It Works

### 1. Transcript Extraction
- Uses `yt-dlp` to access video metadata
- Downloads captions (manual + auto-generated)
- Supports JSON and SRT parsing

### 2. Embedding Generation
- Splits transcript into meaningful chunks
- Generates semantic embeddings using Sentence Transformers

### 3. Vector Search with FAISS
- Stores embeddings inside a FAISS index
- Finds the top most relevant chunks for every query

### 4. LLM Answer Generation
- Sends only relevant chunks to Groq LLM
- Produces accurate, context-aware responses

---

## 📉 Performance Benefits

### Without RAG
❌ Higher API cost  
❌ Slower responses  
❌ Context overload

### With RAG
✅ Faster inference  
✅ Lower token usage  
✅ Better answer quality  
✅ Scalable architecture

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository  
2. Create your feature branch  
3. Commit your changes  
4. Push your branch  
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the **MIT License**.

---

## 👨‍💻 Author

Developed by **Priyanshu Rana**  
GitHub: https://github.com/Prana-labs

---

# ⭐ If you found this project useful, consider giving it a star on GitHub!

**Built for smarter, faster, and more efficient YouTube content understanding 🚀**
