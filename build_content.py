import json

# Le o conteudo do Ebook oficial
with open(r"c:\MP-EGeD-UFRJ\001\002\003\004\EBOOK_COMPLETO_Equilibrio_em_Pontos.md", "r", encoding="utf-8") as f:
    content = f.read()

# Escreve o conteudo dentro de uma variavel Javascript global
with open(r"c:\MP-EGeD-UFRJ\001\002\003\004\site-equilibrio\content.js", "w", encoding="utf-8") as f:
    f.write(f"window.BOOK_CONTENT = {json.dumps(content)};")

print("Conversao feita. content.js gerado com sucesso!")
