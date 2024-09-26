def cmp(c1, c2, phi):
    sz = len(phi[0])
    for i in range(sz):
        if phi[c1][i] == phi[c2][i]:
            continue
        elif phi[c1][i] < phi[c2][i]:
            return True
        else:
            return False
    return False

def partition(C, phi, low, high):
    pivot = high
    i = low - 1

    for j in range(low, high):
        if cmp(j, pivot, phi):
            i += 1
            (C[i], C[j]) = (C[j], C[i])

    (C[i + 1], C[high]) = (C[high], C[i + 1])
    return i + 1

def quicksort(C, phi, low, high):
    if low < high:
        pi = partition(C, phi, low, high)
        quicksort(C, phi, low, pi - 1)
        quicksort(C, phi, pi + 1, high)