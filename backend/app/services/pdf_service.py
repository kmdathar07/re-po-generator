import asyncio
from playwright.async_api import async_playwright


def B(t):
    """Split text by blank lines into blocks."""
    return [b.strip() for b in (t or "").split("\n\n") if b.strip()]

def L(t):
    """Split text into lines."""
    return [l.strip() for l in (t or "").split("\n") if l.strip()]

def contact_bar(r):
    parts = [r.get("email",""), r.get("phone",""), r.get("address",""),
             r.get("linkedin",""), r.get("github","")]
    return " &nbsp;·&nbsp; ".join(p for p in parts if p)

def skill_pills(skills_str, bg, fg):
    if not skills_str: return ""
    pills = ""
    for s in skills_str.split(","):
        s = s.strip()
        if s:
            pills += (f'<span style="background:{bg};color:{fg};padding:3px 10px;border-radius:20px;'
                      f'font-size:9pt;font-weight:700;display:inline-block;margin:2px 1px">{s}</span>')
    return f'<div style="display:flex;flex-wrap:wrap;gap:2px">{pills}</div>'

def exp_blocks(text, title_color, bullet_color="#374151"):
    out = ""
    for block in B(text):
        lines = L(block)
        if not lines: continue
        out += f'<div style="margin-bottom:13px">'
        out += (f'<p style="font-weight:700;font-size:11pt;color:{title_color};'
                f'margin:0 0 4px;line-height:1.3">{lines[0]}</p>')
        for line in lines[1:]:
            clean = line.lstrip("-•·▸ ").strip()
            out += (f'<p style="font-size:9.5pt;color:{bullet_color};'
                    f'margin:2px 0;padding-left:12px;line-height:1.5">▸ {clean}</p>')
        out += "</div>"
    return out

def edu_blocks(text, title_color="#1f2937", sub_color="#6b7280"):
    out = ""
    for block in B(text):
        lines = L(block)
        if not lines: continue
        out += '<div style="margin-bottom:10px">'
        for i, line in enumerate(lines):
            c = title_color if i == 0 else sub_color
            w = "700" if i == 0 else "400"
            s = "10.5pt" if i == 0 else "9.5pt"
            out += f'<p style="font-size:{s};font-weight:{w};color:{c};margin:1px 0;line-height:1.4">{line}</p>'
        out += "</div>"
    return out

def photo_img(src, w, h, radius, border="none"):
    if not src: return ""
    return (f'<img src="{src}" style="width:{w};height:{h};border-radius:{radius};'
            f'object-fit:cover;border:{border};flex-shrink:0" />')

def divider_section(title, color="#1e3a5f"):
    return (f'<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;margin-top:4px">'
            f'<div style="flex:1;height:2px;background:{color}"></div>'
            f'<span style="font-size:8.5pt;font-weight:800;letter-spacing:2px;'
            f'text-transform:uppercase;color:{color};white-space:nowrap">{title}</span>'
            f'<div style="flex:1;height:2px;background:{color}"></div></div>')

def heading(title, color):
    return (f'<h2 style="font-size:9pt;font-weight:800;color:{color};letter-spacing:2px;'
            f'text-transform:uppercase;margin-bottom:10px;margin-top:0">{title}</h2>')


# ─────────────────────────────────────────────────────────────
#  TEMPLATE BUILDERS
# ─────────────────────────────────────────────────────────────

def build_corporate(r):
    ph = photo_img(r.get("photo",""), "80px", "80px", "8px", "3px solid #1e3a5f")
    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: Georgia, 'Times New Roman', serif; background:#fff; color:#1f2937; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
</style>
</head><body>
<div style="width:794px;min-height:1122px;padding:48px 52px;background:#fff">

  <div style="border-bottom:3px solid #1e3a5f;padding-bottom:18px;margin-bottom:24px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
      <div style="flex:1">
        <h1 style="font-size:28pt;font-weight:900;color:#1e3a5f;margin:0;line-height:1.1">{r.get("name") or "Your Name"}</h1>
        {"<p style='font-size:10pt;color:#6b7280;margin-top:7px;max-width:440px;line-height:1.6'>"+r["summary"]+"</p>" if r.get("summary") else ""}
      </div>
      {ph}
    </div>
    <p style="font-size:9pt;color:#4b5563;margin-top:10px">{contact_bar(r)}</p>
  </div>

  <div style="display:grid;grid-template-columns:195px 1fr;gap:26px">

    <div>
      {"<div style='margin-bottom:18px'>"+divider_section("Skills")+skill_pills(r.get("skills"),"#e8eef8","#1e3a5f")+"</div>" if r.get("skills") else ""}
      {"<div style='margin-bottom:18px'>"+divider_section("Education")+edu_blocks(r.get("education",""))+"</div>" if r.get("education") else ""}
      {"<div style='margin-bottom:18px'>"+divider_section("Languages")+"<p style='font-size:9.5pt;line-height:1.6'>"+r.get("languages","")+"</p></div>" if r.get("languages") else ""}
      {"<div>"+divider_section("Links")+"".join(f'<p style="font-size:9pt;word-break:break-all;margin:2px 0">{v}</p>' for v in [r.get("website",""),r.get("instagram","")] if v)+"</div>" if r.get("website") or r.get("instagram") else ""}
    </div>

    <div>
      {"<div style='margin-bottom:18px'>"+divider_section("Work Experience")+exp_blocks(r.get("experience",""),"#1e3a5f")+"</div>" if r.get("experience") else ""}
      {"<div>"+divider_section("Projects")+exp_blocks(r.get("projects",""),"#1e3a5f")+"</div>" if r.get("projects") else ""}
    </div>

  </div>
</div>
</body></html>"""


def build_modern(r):
    name = r.get("name") or "Your Name"
    initials = "".join(w[0] for w in name.split())[:2].upper()
    if r.get("photo"):
        av = (f'<img src="{r["photo"]}" style="width:84px;height:84px;border-radius:50%;'
              f'object-fit:cover;border:3px solid rgba(255,255,255,0.4);margin-bottom:10px" />')
    else:
        av = (f'<div style="width:84px;height:84px;border-radius:50%;background:rgba(255,255,255,0.2);'
              f'display:flex;align-items:center;justify-content:center;font-size:26pt;font-weight:900;'
              f'color:white;margin-bottom:10px">{initials}</div>')

    contact_items = "".join(
        f'<p style="font-size:9pt;margin:3px 0;opacity:.9;word-break:break-all">{v}</p>'
        for v in [r.get("email",""), r.get("phone",""), r.get("address",""), r.get("linkedin",""), r.get("github","")] if v
    )
    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
</style>
</head><body>
<div style="width:794px;min-height:1122px;display:flex;background:#fff">

  <div style="width:235px;min-height:1122px;background:linear-gradient(160deg,#6366f1 0%,#8b5cf6 100%);padding:36px 20px;color:white;flex-shrink:0">
    <div style="text-align:center;margin-bottom:22px">
      {av}
      <h1 style="font-size:16pt;font-weight:900;line-height:1.2">{name}</h1>
    </div>
    {"<div style='margin-bottom:16px'><p style='font-size:7.5pt;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:.65;margin-bottom:6px'>Contact</p>"+contact_items+"</div>" if any([r.get("email"),r.get("phone"),r.get("address")]) else ""}
    {"<div style='margin-bottom:16px'><p style='font-size:7.5pt;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:.65;margin-bottom:6px'>Skills</p>"+skill_pills(r.get("skills"),"rgba(255,255,255,0.2)","white")+"</div>" if r.get("skills") else ""}
    {"<div style='margin-bottom:16px'><p style='font-size:7.5pt;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:.65;margin-bottom:6px'>Education</p>"+edu_blocks(r.get("education",""),"white","rgba(255,255,255,0.75)")+"</div>" if r.get("education") else ""}
    {"<div><p style='font-size:7.5pt;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:.65;margin-bottom:6px'>Languages</p><p style='font-size:9pt;opacity:.9'>"+r.get("languages","")+"</p></div>" if r.get("languages") else ""}
  </div>

  <div style="flex:1;padding:36px 28px">
    {"<div style='margin-bottom:20px;padding:12px 16px;background:#f5f3ff;border-left:4px solid #6366f1;border-radius:0 8px 8px 0'><p style='font-size:10pt;color:#374151;line-height:1.7'>"+r["summary"]+"</p></div>" if r.get("summary") else ""}
    {"<div style='margin-bottom:18px'>"+heading("Work Experience","#6366f1")+exp_blocks(r.get("experience",""),"#4f46e5")+"</div>" if r.get("experience") else ""}
    {"<div>"+heading("Projects","#6366f1")+exp_blocks(r.get("projects",""),"#4f46e5")+"</div>" if r.get("projects") else ""}
  </div>

</div>
</body></html>"""


def build_tech(r):
    ph = photo_img(r.get("photo",""), "76px", "76px", "8px", "2px solid #38bdf8")
    contact_items = " ".join(
        f'<span style="font-size:8pt;color:#38bdf8">&gt; {v}</span>'
        for v in [r.get("email",""), r.get("phone",""), r.get("address",""), r.get("github",""), r.get("linkedin","")] if v
    )
    tech_pills = "".join(
        f'<span style="background:#1e293b;border:1px solid #334155;color:#7dd3fc;'
        f'padding:2px 8px;border-radius:4px;font-size:8.5pt;margin:2px;display:inline-block">{s.strip()}</span>'
        for s in (r.get("skills","")).split(",") if s.strip()
    )
    def tech_exp(text, color):
        out = ""
        for block in B(text):
            ls = L(block)
            if not ls: continue
            out += (f'<div style="margin-bottom:13px;border-left:2px solid {color};padding-left:10px">'
                    f'<p style="color:{color};font-weight:700;font-size:11pt;margin:0 0 4px">{ls[0]}</p>')
            for l in ls[1:]:
                out += f'<p style="font-size:9pt;color:#94a3b8;margin:2px 0">&gt; {l.lstrip("-•").strip()}</p>'
            out += "</div>"
        return out
    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: 'Courier New', Courier, monospace; background:#0f172a; color:#e2e8f0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
</style>
</head><body>
<div style="width:794px;min-height:1122px;background:#0f172a;padding:44px 48px">

  <div style="border-bottom:1px solid #1e293b;padding-bottom:18px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;gap:12px">
    <div>
      <p style="color:#38bdf8;font-size:9pt;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px">// profile</p>
      <h1 style="font-size:26pt;font-weight:900;color:#f1f5f9;margin:0">{r.get("name") or "Your Name"}</h1>
      {"<p style='font-size:9.5pt;color:#94a3b8;margin-top:5px;max-width:380px;line-height:1.5'>"+r["summary"]+"</p>" if r.get("summary") else ""}
    </div>
    {ph}
  </div>

  <div style="background:#1e293b;padding:9px 12px;border-radius:8px;margin-bottom:20px;display:flex;flex-wrap:wrap;gap:12px">
    {contact_items}
  </div>

  <div style="display:grid;grid-template-columns:185px 1fr;gap:22px">
    <div>
      {"<div style='margin-bottom:18px'><p style='color:#f59e0b;font-size:8pt;letter-spacing:2px;text-transform:uppercase;margin-bottom:7px'>// skills</p><div style='display:flex;flex-wrap:wrap'>"+tech_pills+"</div></div>" if r.get("skills") else ""}
      {"<div style='margin-bottom:18px'><p style='color:#f59e0b;font-size:8pt;letter-spacing:2px;text-transform:uppercase;margin-bottom:7px'>// education</p>"+edu_blocks(r.get("education",""),"#e2e8f0","#94a3b8")+"</div>" if r.get("education") else ""}
      {"<div><p style='color:#f59e0b;font-size:8pt;letter-spacing:2px;text-transform:uppercase;margin-bottom:7px'>// languages</p><p style='font-size:9pt;color:#94a3b8'>"+r.get("languages","")+"</p></div>" if r.get("languages") else ""}
    </div>
    <div>
      {"<div style='margin-bottom:18px'><p style='color:#f59e0b;font-size:8pt;letter-spacing:2px;text-transform:uppercase;margin-bottom:7px'>// experience</p>"+tech_exp(r.get("experience",""),"#38bdf8")+"</div>" if r.get("experience") else ""}
      {"<div><p style='color:#f59e0b;font-size:8pt;letter-spacing:2px;text-transform:uppercase;margin-bottom:7px'>// projects</p>"+tech_exp(r.get("projects",""),"#a78bfa")+"</div>" if r.get("projects") else ""}
    </div>
  </div>
</div>
</body></html>"""


def build_startup(r):
    ph = photo_img(r.get("photo",""), "76px", "76px", "12px", "3px solid rgba(255,255,255,0.5)")
    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: Arial, Helvetica, sans-serif; background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
</style>
</head><body>
<div style="width:794px;min-height:1122px;background:#fff">

  <div style="background:linear-gradient(135deg,#f97316 0%,#ef4444 100%);padding:34px 46px 26px;color:white">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:16px">
      <div style="flex:1">
        <h1 style="font-size:27pt;font-weight:900;margin:0;line-height:1.1">{r.get("name") or "Your Name"}</h1>
        {"<p style='font-size:9.5pt;margin-top:6px;opacity:.92;max-width:420px;line-height:1.5'>"+r["summary"]+"</p>" if r.get("summary") else ""}
      </div>
      {ph}
    </div>
    <p style="font-size:8.5pt;margin-top:12px;opacity:.88">{contact_bar(r)}</p>
  </div>

  <div style="padding:26px 46px;display:grid;grid-template-columns:185px 1fr;gap:22px">
    <div>
      {"<div style='margin-bottom:16px'>"+heading("Skills","#f97316")+skill_pills(r.get("skills"),"#fff7ed","#c2410c")+"</div>" if r.get("skills") else ""}
      {"<div style='margin-bottom:16px'>"+heading("Education","#f97316")+edu_blocks(r.get("education",""))+"</div>" if r.get("education") else ""}
      {"<div>"+heading("Languages","#f97316")+"<p style='font-size:9.5pt'>"+r.get("languages","")+"</p></div>" if r.get("languages") else ""}
    </div>
    <div>
      {"<div style='margin-bottom:16px'>"+heading("Experience","#f97316")+exp_blocks(r.get("experience",""),"#f97316")+"</div>" if r.get("experience") else ""}
      {"<div>"+heading("Projects","#f97316")+exp_blocks(r.get("projects",""),"#ea580c")+"</div>" if r.get("projects") else ""}
    </div>
  </div>

</div>
</body></html>"""


def build_creative(r):
    name = r.get("name") or "Your Name"
    initials = "".join(w[0] for w in name.split())[:2].upper()
    if r.get("photo"):
        av = (f'<img src="{r["photo"]}" style="width:90px;height:90px;border-radius:12px;'
              f'object-fit:cover;border:3px solid white;margin-bottom:12px;display:block" />')
    else:
        av = (f'<div style="width:90px;height:90px;border-radius:12px;background:white;'
              f'display:flex;align-items:center;justify-content:center;font-size:28pt;font-weight:900;'
              f'color:#f59e0b;margin-bottom:12px">{initials}</div>')
    skill_list = "".join(
        f'<span style="background:rgba(0,0,0,0.15);padding:2px 8px;border-radius:3px;font-size:8.5pt;font-weight:700;color:#18181b;margin:2px;display:inline-block">{s.strip()}</span>'
        for s in (r.get("skills","")).split(",") if s.strip()
    )
    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: Arial, Helvetica, sans-serif; background:#18181b; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
</style>
</head><body>
<div style="width:794px;min-height:1122px;background:#18181b;display:flex">

  <div style="width:205px;min-height:1122px;background:#f59e0b;padding:38px 18px;flex-shrink:0">
    {av}
    <h1 style="font-size:17pt;font-weight:900;color:#18181b;line-height:1.2;margin-bottom:4px">{name}</h1>
    <div style="height:3px;background:#18181b;width:36px;margin-bottom:14px"></div>
    {"".join(f'<p style="font-size:8.5pt;color:#18181b;margin:3px 0;word-break:break-all">{v}</p>' for v in [r.get("email",""),r.get("phone",""),r.get("address","")] if v)}
    {"<div style='margin-top:16px'><p style='font-size:7pt;font-weight:800;letter-spacing:2px;color:#18181b;text-transform:uppercase;margin-bottom:6px;opacity:.7'>Skills</p><div style='display:flex;flex-wrap:wrap;gap:2px'>"+skill_list+"</div></div>" if r.get("skills") else ""}
    {"<div style='margin-top:16px'><p style='font-size:7pt;font-weight:800;letter-spacing:2px;color:#18181b;text-transform:uppercase;margin-bottom:6px;opacity:.7'>Education</p>"+edu_blocks(r.get("education",""),"#18181b","#3f3f46")+"</div>" if r.get("education") else ""}
    {"<div style='margin-top:16px'><p style='font-size:7pt;font-weight:800;letter-spacing:2px;color:#18181b;text-transform:uppercase;margin-bottom:6px;opacity:.7'>Languages</p><p style='font-size:9pt;color:#18181b'>"+r.get("languages","")+"</p></div>" if r.get("languages") else ""}
  </div>

  <div style="flex:1;padding:36px 26px;color:#fafafa">
    {"<div style='margin-bottom:20px;padding:12px 16px;background:#27272a;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0'><p style='font-size:10pt;color:#d4d4d8;line-height:1.7'>"+r["summary"]+"</p></div>" if r.get("summary") else ""}
    {"<div style='margin-bottom:18px'><p style='font-size:7.5pt;color:#f59e0b;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px'>Experience</p>"+exp_blocks(r.get("experience",""),"#f59e0b","#a1a1aa")+"</div>" if r.get("experience") else ""}
    {"<div><p style='font-size:7.5pt;color:#f59e0b;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px'>Projects</p>"+exp_blocks(r.get("projects",""),"#fafafa","#a1a1aa")+"</div>" if r.get("projects") else ""}
  </div>

</div>
</body></html>"""


def build_academic(r):
    ph = photo_img(r.get("photo",""), "66px", "66px", "50%", "2px solid #1a1a1a")
    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: 'Times New Roman', Times, serif; background:#fff; color:#1a1a1a; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
  h2 {{ font-size:11pt; font-weight:900; text-transform:uppercase; border-bottom:1px solid #ccc; padding-bottom:3px; margin-bottom:9px; letter-spacing:1px; }}
</style>
</head><body>
<div style="width:794px;min-height:1122px;padding:52px 60px;background:#fff">

  <div style="text-align:center;border-bottom:2px solid #1a1a1a;padding-bottom:16px;margin-bottom:22px">
    {"<div style='display:flex;justify-content:center;margin-bottom:8px'>"+ph+"</div>" if ph else ""}
    <h1 style="font-size:24pt;font-weight:900;text-transform:uppercase;letter-spacing:2px">{r.get("name") or "Your Name"}</h1>
    <p style="font-size:9.5pt;margin-top:6px;color:#333">{contact_bar(r)}</p>
  </div>

  {"<div style='margin-bottom:18px'><h2>Summary</h2><p style='font-size:10pt;line-height:1.8;text-align:justify'>"+r["summary"]+"</p></div>" if r.get("summary") else ""}
  {"<div style='margin-bottom:18px'><h2>Education</h2>"+edu_blocks(r.get("education",""))+"</div>" if r.get("education") else ""}
  {"<div style='margin-bottom:18px'><h2>Work Experience</h2>"+exp_blocks(r.get("experience",""),"#1a1a1a")+"</div>" if r.get("experience") else ""}
  {"<div style='margin-bottom:18px'><h2>Skills &amp; Competencies</h2><p style='font-size:10pt;line-height:1.8'>"+r.get("skills","")+"</p></div>" if r.get("skills") else ""}
  {"<div style='margin-bottom:18px'><h2>Projects</h2>"+exp_blocks(r.get("projects",""),"#1a1a1a")+"</div>" if r.get("projects") else ""}
  {"<div><h2>Languages</h2><p style='font-size:10pt'>"+r.get("languages","")+"</p></div>" if r.get("languages") else ""}

</div>
</body></html>"""


def build_minimal_ats(r):
    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: Arial, Helvetica, sans-serif; background:#fff; color:#111; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
  .sec-title {{ font-size:10pt; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; border-bottom:1.5px solid #111; padding-bottom:3px; margin-bottom:9px; }}
</style>
</head><body>
<div style="width:794px;min-height:1122px;padding:52px 60px;background:#fff">

  <h1 style="font-size:26pt;font-weight:900;margin-bottom:5px;letter-spacing:-0.5px">{r.get("name") or "Your Name"}</h1>
  <p style="font-size:9.5pt;color:#333;margin-bottom:8px">{contact_bar(r)}</p>
  {"<p style='font-size:10pt;line-height:1.8;color:#222;margin-bottom:18px;max-width:540px'>"+r["summary"]+"</p>" if r.get("summary") else ""}

  {"<div style='margin-bottom:18px'><div class='sec-title'>Skills</div><p style='font-size:10pt;line-height:1.8'>"+r.get("skills","")+"</p></div>" if r.get("skills") else ""}
  {"<div style='margin-bottom:18px'><div class='sec-title'>Work Experience</div>"+exp_blocks(r.get("experience",""),"#111")+"</div>" if r.get("experience") else ""}
  {"<div style='margin-bottom:18px'><div class='sec-title'>Education</div>"+edu_blocks(r.get("education",""))+"</div>" if r.get("education") else ""}
  {"<div style='margin-bottom:18px'><div class='sec-title'>Projects</div>"+exp_blocks(r.get("projects",""),"#111")+"</div>" if r.get("projects") else ""}
  {"<div><div class='sec-title'>Languages</div><p style='font-size:10pt'>"+r.get("languages","")+"</p></div>" if r.get("languages") else ""}

</div>
</body></html>"""


BUILDERS = {
    "corporate":   build_corporate,
    "modern":      build_modern,
    "tech":        build_tech,
    "startup":     build_startup,
    "creative":    build_creative,
    "academic":    build_academic,
    "minimal_ats": build_minimal_ats,
}


async def generate_pdf_from_data(resume_data: dict, template: str) -> bytes:
    """
    Generates resume PDF by building complete HTML in Python
    and feeding it directly to Playwright — zero dependency on frontend.
    """
    builder = BUILDERS.get(template, build_corporate)
    html    = builder(resume_data)

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ]
        )
        page = await browser.new_page(viewport={"width": 794, "height": 1122})

        # Feed HTML directly — no network request, no React needed
        await page.set_content(html, wait_until="domcontentloaded")
        await page.wait_for_timeout(400)

        pdf_bytes = await page.pdf(
            format="A4",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        await browser.close()

    return pdf_bytes