# backend/services/parsers.py
import re, json
from typing import List

# Android-style export: 12/31/2025, 9:03 PM - Name: Message
WHATSAPP_PATTERN_DASH = re.compile(
    r"^\d{1,2}/\d{1,2}/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?\s-\s(.+?):\s(.+)$"
)

# iOS-style export: [12/31/2025, 9:03:12 PM] Name: Message
WHATSAPP_PATTERN_BRACKET = re.compile(
    r"^\[\d{1,2}/\d{1,2}/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?\]\s(.+?):\s(.+)$"
)

def parse_whatsapp(file_text: str, user_name: str) -> List[str]:
    messages = []
    for line in file_text.splitlines():
        line = line.strip()
        m = WHATSAPP_PATTERN_DASH.match(line) or WHATSAPP_PATTERN_BRACKET.match(line)
        if not m:
            continue

        sender, text = m.group(1).strip(), m.group(2).strip()
        # If a username was provided, only keep the user's own messages.
        if user_name and sender.lower() != user_name.lower():
            continue
        if text in ("<Media omitted>", "image omitted"):
            continue
        if len(text) < 15:
            continue
        messages.append(text)
    return messages

def parse_chatgpt(file_text: str) -> List[str]:
    try: data = json.loads(file_text)
    except json.JSONDecodeError: return []
    messages = []
    for conversation in data:
        for node in conversation.get("mapping", {}).values():
            msg = node.get("message")
            if not msg: continue
            if msg.get("author", {}).get("role") != "user": continue
            for part in msg.get("content", {}).get("parts", []):
                if isinstance(part, str) and len(part.strip()) > 30:
                    messages.append(part.strip())
    return messages

def parse_claude_export(file_text: str) -> List[str]:
    try: data = json.loads(file_text)
    except json.JSONDecodeError: return []
    messages = []
    for conversation in data:
        for msg in conversation.get("chat_messages", []):
            if msg.get("sender") != "human": continue
            content = msg.get("text", "") or msg.get("content", "")
            if isinstance(content, list):
                for block in content:
                    if isinstance(block, dict) and block.get("type") == "text":
                        t = block.get("text", "")
                        if len(t.strip()) > 30: messages.append(t.strip())
            elif isinstance(content, str) and len(content.strip()) > 30:
                messages.append(content.strip())
    return messages

def parse_file(file_text: str, source: str, user_name: str = "") -> List[str]:
    if source == "whatsapp": return parse_whatsapp(file_text, user_name)
    elif source == "chatgpt": return parse_chatgpt(file_text)
    elif source == "claude": return parse_claude_export(file_text)
    else: return [ln.strip() for ln in file_text.splitlines() if len(ln.strip()) > 20]
