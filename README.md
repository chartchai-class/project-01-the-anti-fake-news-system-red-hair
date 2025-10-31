# Red Hair - Anti Fake News System

The Project for SE331 Component-Based Software Development 
where the users can post news, comments and vote the news as fake or not fake.

This repository is meant for developing **Frontend** for the project.

Course code: 953331

Semester: 1/2025


## Team members:

- 652115050 - Siraphop Guntiya (Sec - 701)
- 662115510 - Min Thant Ko (Sec - 701)
- 662115515 - Saw Rory Yin (Sec - 701)

---

## Deployed link

- Frontend: http://54.167.67.248:8001
- Backend (phpMyAdmin) : http://98.93.147.121:9000

*Deployed using AWS EC2.*

## Repository Links
- Frontend Repository: https://github.com/chartchai-class/project-01-the-anti-fake-news-system-red-hair
- Backend Repository: https://github.com/chartchai-class/the-social-anti-fake-news-system-phase-ii-red-hair

---

## Overview
The **Anti-Fake News System** is a web application that allows users to view, share, and evaluate news credibility through community interaction.  
It aims to reduce the spread of misinformation by enabling users to **vote** and **comment** on whether a news article is **fake** or **not fake**.  

This repository contains the **frontend** built using **Vue.js** with **Tailwind CSS**, following a **component-based software development** approach.

---

## Features

### Non-Logged-In Users
- View all published news articles  
- Search for specific news items by title or content or reporter

### Readers (Registered Users)
- Vote whether a news article is *fake* or *not fake*  
- Leave comments on news articles  

### Members
- All reader functionalities (vote, comment)  
- Post new news articles  

### Admins
- All member functionalities  
- Manage users (change roles)
- Delete or undelete news and comments

---

## Authentication System

### **Sign Up**
Users can create an account by providing:
- First Name  
- Last Name  
- Username  
- Display Name  
- Email Address  
- Phone Number  
- Profile Image  
- Password  

### **Log In**
- Authentication is done using **username** and **password**.

---

## User Profile Management
Logged-in users can edit their personal information:
- First Name  
- Last Name  
- Display Name
- Phone Number  
- Email Address  
- Profile Image  

---

## News Voting Logic
Each news article’s credibility status dynamically updates based on the **number of votes** indicating whether it is *fake* or *not fake*.

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [Vue 3](https://vuejs.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Image Handling | [Supabase Storage](https://supabase.com/) |
| Design Approach | Component-Based Software Development |
| State Management | Pinia / Vuex |