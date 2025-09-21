from flask import Flask, render_template,request,url_for,redirect,jsonify
from flask_cors import CORS
import os
from langchain.memory import ConversationBufferMemory
import logging
from gemini_setup import get_gemini_response

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s} %(message)s',
    handlers=[logging.StreamHandler()]
)

app = Flask(__name__)
CORS(app) 
@app.route("/")
def home():
    return render_template("index.html") 

@app.route("/login",methods=["POST","GET"])
def login():
        return render_template("login.html")

@app.route("/<usr>")
def user(usr):
    return f"<h1>{usr}</h1>"

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

@app.route("/course")
def course():
    return render_template("course.html")

@app.route('/college')
def college():
    return render_template("college.html")

@app.route('/timeline')
def timeline():
    return render_template("timeline.html")

@app.route('/aboutus')
def aboutus():
    return render_template("aboutus.html")

@app.route('/ctc')
def ctc():
    return render_template("ctc.html")    
@app.route('/contact')
def contact():
    return render_template("contact.html")

@app.route("/successtory")
def stories():
    return render_template("success.html")

@app.route('/s1q')
def chatbot():
    return redirect("https://niraj-12879.app.n8n.cloud/webhook/4a410a85-84c3-4875-8718-6a45ac59b10e/chat")






if __name__=='__main__':
    app.run(host='0.0.0.0',port=8080,debug=True)


