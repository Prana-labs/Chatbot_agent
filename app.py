import streamlit as st

# import your functions
from yt_chatbot import process_video, answer_query

st.set_page_config(page_title="YouTube Chatbot", layout="wide")

st.title("🎥 YouTube Video Chatbot")

# Session state to persist retriever
if "retriever" not in st.session_state:
    st.session_state.retriever = None

# Input: Video ID
video_id = st.text_input("Enter YouTube Video ID")

if st.button("Process Video"):
    if video_id:
        with st.spinner("Processing video..."):
            st.session_state.retriever = process_video(video_id)
        st.success("Video processed successfully!")
    else:
        st.warning("Please enter a video ID")

# Query section
query = st.text_input("Ask a question from the video")

if st.button("Get Answer"):
    if st.session_state.retriever is None:
        st.warning("Process a video first")
    elif query:
        with st.spinner("Generating answer..."):
            answer = answer_query(st.session_state.retriever, query)
        st.write("### Answer:")
        st.write(answer)
    else:
        st.warning("Enter a query")