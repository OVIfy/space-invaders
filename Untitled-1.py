print('yeah')

def dprint(*args):
    print(args)
    for i,k in enumerate(args):
        print(i,k)

dprint('j',2,'k',4)