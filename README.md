# 📒 Hisaab - Simple File-Based Note Manager

**Hisaab** is a lightweight note-taking web application built with Node.js and Express.js. It lets you create, view, edit, and delete text-based notes stored as `.txt` files in a local directory. Ideal for keeping track of personal records or tasks.

---

## 🚀 Features

* 📄 Create new notes
* 📂 List all existing notes
* ✏️ Edit existing notes
* 📖 View a note’s content
* 🗑️ Delete notes

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Templating Engine**: EJS
* **Frontend**: HTML, CSS (static files in `/public`)

---

## 📁 Project Structure

```
hisaab-app/
│
├── public/             # Static assets (optional CSS/JS)
├── views/              # EJS templates (index, create, edit, hisaab)
│   ├── index.ejs
│   ├── create.ejs
│   ├── edit.ejs
│   └── hisaab.ejs
├── hisaab/             # All saved notes (.txt files)
├── app.js              # Main application file
└── package.json
```

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd hisaab-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the `hisaab` directory

This is where all the note `.txt` files will be saved.

```bash
mkdir hisaab
```

### 4. Run the server

```bash
node app.js
```

### 5. Open in your browser

```
http://localhost:3000
```

---

## 🧱 Routes Overview

| Method | Route            | Description                             |
| ------ | ---------------- | --------------------------------------- |
| GET    | `/`              | List all notes from the `hisaab` folder |
| GET    | `/create`        | Show form to create a new note          |
| POST   | `/createhisaab`  | Save a new note as a `.txt` file        |
| GET    | `/hisaab/:title` | View the content of a specific note     |
| GET    | `/edit/:title`   | Load an existing note for editing       |
| POST   | `/update/:title` | Save changes to a note                  |
| GET    | `/delete/:title` | Delete a specific note                  |

---

## 📝 Example Usage

* Go to `/create` to write a new note.
* Visit `/` to see the list of all notes.
* Click a note to view or edit it.
* Delete a note using its corresponding link.

---

## ⚠️ Notes

* All notes are stored locally as `.txt` files inside the `hisaab/` directory.
* The directory must exist before starting the server, or the app will throw errors.
* This app is designed for **local or development use only**—no user authentication or data sanitization is included.

---

## 💡 Ideas for Future Improvement

* Add user authentication
* Support Markdown or rich text formatting
* Enable search or filtering
* Add timestamps or version history
* Deploy to Heroku or Render

---

## 📄 License

This project is licensed under the **MIT License**.

---

> Made with ❤️ using Node.js and Express
