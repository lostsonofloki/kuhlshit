# @kuhlshit.com Email — cPanel / HostGator Setup

Lightweight runbook for wiring professional email on `kuhlshit.com` once the
cPanel credentials from Alan are in hand. Nothing in the repo reads this
directly; it is meant to be a checkable, two-sitting task.

## 1. Confirm DNS ownership

`kuhlshit.com` DNS is currently managed wherever the apex record lives
(check with `nslookup -type=NS kuhlshit.com`). The MX records point the
domain at a mail host; they must sit in the *same* zone as the A / CNAME
records that serve the site.

- If DNS is at HostGator: `cPanel → Zone Editor` for `kuhlshit.com`.
- If DNS is at a registrar (GoDaddy, Namecheap, Cloudflare, etc.): add
  records there and leave HostGator as the mail host.

## 2. Add the mailboxes in cPanel

`cPanel → Email → Email Accounts → Create`

Recommended addresses:

| Address | Purpose | Notes |
|---|---|---|
| `hello@kuhlshit.com` | Public-facing contact | Friendly, default reply-from. |
| `waitlist@kuhlshit.com` | Waitlist signups | Target for `VITE_WAITLIST_ENDPOINT` responses. |
| `josh@kuhlshit.com` | Personal | Optional. |
| `alan@kuhlshit.com` | Personal | Optional. |

Pick strong passwords; store them in the password manager.

## 3. DNS records to add

From HostGator's cPanel (or your registrar), add the following. Replace
`mail.kuhlshit.com` with the HostGator-supplied mailserver hostname if they
provide a different one.

| Type | Host | Value | Priority / TTL |
|---|---|---|---|
| MX | `@` | `mail.kuhlshit.com` | Priority 0, TTL 14400 |
| A | `mail` | HostGator shared-IP for the account | TTL 14400 |
| TXT | `@` | `v=spf1 +a +mx +ip4:<shared-ip> ~all` | TTL 14400 |
| TXT | `default._domainkey` | DKIM public key (copy from cPanel → Email Deliverability) | TTL 14400 |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:hello@kuhlshit.com` | TTL 14400 |

DKIM and SPF are what keep Gmail / Outlook from dumping us in spam when we
reply from `hello@kuhlshit.com`.

## 4. Verify

```bash
# MX should resolve to the HostGator mail host
nslookup -type=mx kuhlshit.com

# SPF / DKIM / DMARC should all return TXT records
nslookup -type=txt kuhlshit.com
nslookup -type=txt default._domainkey.kuhlshit.com
nslookup -type=txt _dmarc.kuhlshit.com
```

Send a test email from `hello@kuhlshit.com` to a personal Gmail inbox and
check the header for `SPF=pass` and `DKIM=pass`.

## 5. Wire the product

Once mail is live, two lightweight follow-ups inside the repo become useful:

1. Set `VITE_WAITLIST_ENDPOINT` in `.env` to a Formspree / serverless handler
   that forwards to `waitlist@kuhlshit.com`. The waitlist page in
   `src/pages/WaitlistPage.jsx` already reads this variable; it falls back
   to `localStorage` when absent.
2. Update `src/components/Footer.jsx` with a `mailto:hello@kuhlshit.com`
   link so the platform has a visible human contact.

## 6. Optional — forward to Gmail

If you'd rather read everything from Gmail:

`cPanel → Email → Forwarders → Add Forwarder` and forward each alias to
your personal Gmail. Keep IMAP off on the cPanel side to avoid double-sync
weirdness.

---

Nothing here blocks shipping the waitlist form. The product will collect
signups without email, and you can flip them over to real notifications the
day after DNS propagates.
