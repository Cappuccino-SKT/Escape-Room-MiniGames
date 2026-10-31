# ===== GERA OS PDFs DA DOCUMENTAÇÃO =====
# Converte cada arquivo .md da pasta do projeto em um PDF (pasta pdf/), para a equipe ler e imprimir.
# Rode de novo sempre que os guias mudarem:  python gerar-pdfs.py
# Precisa do Google Chrome (ou Microsoft Edge) e do pacote markdown:  python -m pip install markdown
import os
import re
import subprocess
import sys
import tempfile
from datetime import date

import markdown

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "pdf")

# arquivo .md → nome do PDF e título da capa
DOCS = [
    ("README.md", "Escape-Room-Visao-Geral.pdf", "Visão geral do projeto"),
    ("TESTES-NIVEL1.md", "Guia-Nivel-1-As-Notas.pdf", "Guia do Nível 1 — As Notas"),
    ("TESTES-NIVEL2.md", "Guia-Nivel-2-O-Cumplice.pdf", "Guia do Nível 2 — O Cúmplice"),
    ("TESTES-NIVEL3.md", "Guia-Nivel-3-A-Prova-Final.pdf", "Guia do Nível 3 — A Prova Final"),
    ("CLAUDE.md", "Contexto-Tecnico-do-Projeto.pdf", "Contexto técnico do projeto"),
]

BROWSERS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

CSS = """
@page { size: A4; margin: 16mm 15mm 18mm; }
* { box-sizing: border-box; }
body { margin: 0; font: 10.5pt/1.55 "Segoe UI", Arial, sans-serif; color: #1d1d1f; }
.cover { border-bottom: 3px solid #8b0000; padding-bottom: 8px; margin-bottom: 18px; }
.cover small { color: #8b0000; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 8.5pt; }
.cover h1 { margin: 4px 0 2px; font-size: 22pt; color: #111; border: 0; }
.cover .meta { color: #666; font-size: 8.5pt; }
h1 { font-size: 17pt; color: #8b0000; margin: 22px 0 8px; }
h2 { font-size: 13.5pt; color: #8b0000; margin: 22px 0 8px; padding-bottom: 3px; border-bottom: 1px solid #e3c9c9; break-after: avoid; }
h3 { font-size: 11.5pt; color: #333; margin: 16px 0 6px; break-after: avoid; }
p { margin: 0 0 8px; }
ul, ol { margin: 0 0 10px; padding-left: 22px; }
li { margin-bottom: 3px; }
strong { color: #000; }
code { font: 9pt Consolas, "Courier New", monospace; background: #f3f0f0; border: 1px solid #e2dada; border-radius: 3px; padding: 0 3px; }
pre { background: #1e1e1e; color: #e6e6e6; padding: 10px 12px; border-radius: 5px; overflow: hidden; white-space: pre-wrap; break-inside: avoid; }
pre code { background: none; border: 0; color: inherit; padding: 0; font-size: 8.8pt; }
blockquote { margin: 0 0 12px; padding: 8px 12px; background: #fff3f3; border-left: 4px solid #c00; color: #5a0000; break-inside: avoid; }
blockquote p { margin: 0; }
table { width: 100%; border-collapse: collapse; margin: 6px 0 14px; font-size: 9.3pt; break-inside: auto; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th { background: #8b0000; color: #fff; text-align: left; padding: 5px 7px; font-weight: 600; }
td { padding: 5px 7px; border-bottom: 1px solid #e6e6e6; vertical-align: top; }
tr:nth-child(even) td { background: #faf7f7; }
hr { border: 0; border-top: 1px solid #ddd; margin: 18px 0; }
a { color: #8b0000; text-decoration: none; }
"""


def find_browser():
    for b in BROWSERS:
        if os.path.exists(b):
            return b
    sys.exit("Não achei o Chrome nem o Edge. Instale um deles ou ajuste a lista BROWSERS.")


def prepare(md_text):
    """Ajusta o Markdown do GitHub para o conversor: tira o 1º título (a capa já tem um) e põe uma linha em branco
    antes de listas coladas no parágrafo anterior (sem isso, os itens viram texto corrido)."""
    lines, out, in_code, first_h1 = md_text.splitlines(), [], False, True
    is_item = lambda l: re.match(r"^\s*([-*]|\d+\.)\s", l)
    for line in lines:
        if line.strip().startswith("```"):
            in_code = not in_code
        if not in_code:
            if first_h1 and line.lstrip().startswith("# "):
                first_h1 = False
                continue
            if is_item(line) and out and out[-1].strip() and not is_item(out[-1]) and not out[-1].startswith("|"):
                out.append("")
        out.append(line)
    return "\n".join(out)


def to_html(md_text, title, source):
    body = markdown.markdown(prepare(md_text), extensions=["tables", "fenced_code", "sane_lists"])
    today = date.today().strftime("%d/%m/%Y")
    return f"""<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>{title}</title><style>{CSS}</style></head>
<body><div class="cover"><small>Escape Room · Jogos Mortais · JIGSAW OS</small><h1>{title}</h1>
<div class="meta">Gerado de {source} em {today}</div></div>{body}</body></html>"""


def main():
    browser = find_browser()
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for src, pdf_name, title in DOCS:
            path = os.path.join(ROOT, src)
            if not os.path.exists(path):
                print(f"(pulado: {src} não existe)")
                continue
            with open(path, encoding="utf-8-sig") as f:  # utf-8-sig: ignora o BOM do início do arquivo
                html = to_html(f.read(), title, src)
            html_path = os.path.join(tmp, pdf_name.replace(".pdf", ".html"))
            with open(html_path, "w", encoding="utf-8") as f:
                f.write(html)
            pdf_path = os.path.join(OUT, pdf_name)
            subprocess.run([browser, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                            f"--print-to-pdf={pdf_path}", "file:///" + html_path.replace("\\", "/")],
                           check=True, capture_output=True, timeout=120)
            print(f"ok  {src}  ->  pdf/{pdf_name}")


if __name__ == "__main__":
    main()
