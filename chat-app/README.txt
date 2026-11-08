Chat App
========
Features: world communities anyone can create (auto admin + admins, Main Stage with admitted speakers, groups, open lounge), the built-in "myChat world chat", locked chats with their own password, accounts with password reset (recovery code), saved messages, groups
(multiple admins, admin-only posting, "seen by", group pictures, polls, history choice),
edit/delete/reply, voice notes with waveform and playback speed, photos and files (20 MB),
disappearing messages (1 hour / 24 hours / 7 days), pin and mute chats, profile pictures,
last seen, World chat (public room), forward messages, share/export chat, Status (1 to 7 days, chosen audience, view limits, mute, replies, hold to pause), view-once with a view count, emoji picker and message reactions, delete for me / for everyone (with a switch to refuse others deleting your copy), view-once photos and voice notes, block users, delete chat (for you), voice/video calls, black and red theme (light option), installable app.

1. Install Node.js (version 16 or newer) from nodejs.org
2. Open a terminal in this folder
3. Run:  npm install
4. Run:  npm start
5. Open http://localhost:3000 and sign up. SAVE the recovery code it shows you.

Notes:
- Voice notes, calls and "Install app" need HTTPS (or localhost).
- Data is saved in db.json and the uploads/ folder next to chat.js. Back them up.

Extra files in this package:
  db.json (starts empty), uploads/, start.sh (Mac/Linux/Termux), start.bat (Windows).
  start.sh / start.bat download Socket.IO the first time (internet needed once).

Security (v1.1)
---------------
- Login/recovery attempts are rate limited per IP, per name and per IP+name; sign-ups: 5 per hour per IP.
- Login tokens are stored hashed, expire after 30 days unused, max 10 devices per account.
  A password reset signs out every other device. Old tokens are upgraded automatically.
- Security headers + Content-Security-Policy on all pages; sockets only accept your own site's origin.
- Uploaded photos / voice notes / avatars are checked against their real file signature.
- Optional environment variables (use them when running behind HTTPS / a reverse proxy):
    TRUST_PROXY=1       read the real visitor IP from X-Forwarded-For (otherwise all users look like the proxy)
    FORCE_HTTPS=1       redirect http to https (needs TRUST_PROXY=1)
    ALLOWED_ORIGINS=https://chat.example.com   extra allowed origins, comma separated
  Example:  TRUST_PROXY=1 FORCE_HTTPS=1 npm start
  Your proxy must pass the original Host header (nginx: proxy_set_header Host $host;) and WebSocket upgrades.


World communities (v1.3)
------------------------
- Every account can create its own world community: chat list > "Communities" > type a name > Create (up to 3 per account).
  Anyone can then find it on the same page and join, or leave again.
- The creator is the AUTO ADMIN. A gray "auto" label is shown in front of their name on the community page and on their
  messages in the community's Main Stage and lounge.
- The built-in community "myChat world chat" is the original world chat, renamed automatically. Everyone is in it.
  Its auto admin is the first account ever created. It cannot be renamed, deleted or left.
- Each community has: a Main Stage (everyone reads, only admitted speakers and admins post), an Open lounge (everyone chats),
  and the groups that joined it. A group admin adds or removes their own group on the community page.

Who can do what
                                                    Admin   Auto admin
  Remove a person from the community (and ban them)   yes      yes
  Remove a person from one of the community's groups  yes      yes
  Unban people                                        yes      yes
  Choose Main Stage speakers                          yes      yes
  Remove a group from the community                   yes      yes
  Delete any message in the lounge / Main Stage       yes      yes (also the auto admin's own messages: only auto)
  Add admins (pick from the community's people)       no       yes
  Remove admins                                       no       yes
  Rename or delete the community                      no       yes
  Admins cannot remove the auto admin or other admins. Nobody can remove the auto admin.
- Open the community from your chat list to manage it. "Add admin" shows the people in the community with a search box.
- WORLD_ADMINS=name1,name2 (optional) makes those people regular admins of myChat world chat.
- Upgrading from v1.2: the old World community becomes myChat world chat on first start (its first admin becomes the
  auto admin, the others stay admins, groups and speakers are kept). Back up db.json before the first start.

Locked chats
------------
- Create a "chat lock password" (sidebar > Chat lock password). It must be different from your login password.
- Open any chat > menu > "Lock this chat". Locked chats show a lock and no message preview, and ask for the lock
  password to open. They lock again when you leave the chat or after 30 seconds in the background.
- Forgot the lock password? Change it by entering your login password in the "current password" box.
- This is a screen lock for the app: messages are still stored on the server like any others (no encryption yet).
