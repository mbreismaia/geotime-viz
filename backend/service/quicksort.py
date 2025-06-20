def cmp(c1, c2):
    sz = len(c1.phi)
    for i in range(sz):
        if c1.phi[i] == c2.phi[i]:
            continue
        elif c1.phi[i] < c2.phi[i]:
            return True
        else:
            return False
    return False

def partition(C, low, high):
    pivot = C[high]
    i = low - 1

    for j in range(low, high):
        if cmp(C[j], pivot):
            i += 1
            (C[i], C[j]) = (C[j], C[i])

    (C[i + 1], C[high]) = (C[high], C[i + 1])
    return i + 1

def quicksort(C, low, high):
    if low < high:
        pi = partition(C, low, high)
        quicksort(C, low, pi - 1)
        quicksort(C, pi + 1, high)