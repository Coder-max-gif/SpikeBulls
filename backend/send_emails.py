import asyncio
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent))

from core.config import settings
from core.database import get_db
from core.email import send_email, wrap_email


async def list_users():
    """List all registered users"""
    db = get_db()
    users = await db.users.find({}).to_list(100)
    print(f"\n📋 Found {len(users)} registered user(s):")
    for i, user in enumerate(users, 1):
        print(f"  {i}. {user['email']} - {user['name']} (Role: {user['role']})")
    return users


async def send_email_to_user(user, subject, body):
    """Send an email to a single user"""
    html = wrap_email(
        title=subject,
        body_html=body,
        cta_label="Visit Dashboard",
        cta_url=f"{settings.APP_URL}/dashboard"
    )
    
    success = await send_email(
        to=user["email"],
        subject=subject,
        html=html
    )
    
    return success


async def send_to_all_users(subject, body):
    """Send email to all registered users"""
    users = await list_users()
    
    if not users:
        print("\n❌ No registered users found!")
        return
    
    print(f"\n📧 Sending emails to {len(users)} user(s)...")
    
    success_count = 0
    for user in users:
        print(f"  → Sending to: {user['email']}...")
        try:
            success = await send_email_to_user(user, subject, body)
            if success:
                print(f"    ✅ Sent successfully!")
                success_count += 1
            else:
                print(f"    ❌ Failed to send!")
        except Exception as e:
            print(f"    ❌ Error: {str(e)}")
    
    print(f"\n✅ Done! Sent {success_count}/{len(users)} emails successfully!")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Send emails to registered users")
    parser.add_argument("--list", action="store_true", help="List all registered users")
    parser.add_argument("--subject", type=str, help="Email subject")
    parser.add_argument("--body", type=str, help="Email body (HTML)")
    
    args = parser.parse_args()
    
    if args.list:
        asyncio.run(list_users())
    elif args.subject and args.body:
        asyncio.run(send_to_all_users(args.subject, args.body))
    else:
        print("""
📧 SpikeBulls Email Sender

Usage:
  python send_emails.py --list                    # List all registered users
  python send_emails.py --subject "Hello" --body "<p>Hi there!</p>"  # Send email to all

Example welcome email:
  python send_emails.py --subject "Welcome to SpikeBulls" --body "<p>Thank you for joining SpikeBulls! We're excited to have you on board.</p><p>You can now browse our products, purchase indicators, and manage your licenses from your dashboard.</p>"
""")
