cont = 1
soma_medias = 0.0
maior_media = 0
menor_media = 11
num_alunos = 2

while cont <= num_alunos:
    print(f"Aluno {cont}")
    
    n1 = float(input("Entre com a primeira nota: "))
    n2 = float(input("Entre com a segunda nota: "))
    
    media_individual = (n1 + n2) / 2
    soma_medias += media_individual
    
    if media_individual > maior_media:
        maior_media = media_individual
    if media_individual < menor_media:
        menor_media = media_individual

    cont += 1
    
media_turma = soma_medias / num_alunos

print(f"  A média da turma foi {media_turma}, a maior média foi {maior_media} e a menor média foi {menor_media}.")