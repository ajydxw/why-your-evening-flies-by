import sys
# usage: python3 qs.py 64.3 65 ... -> comma list of seconds
print(','.join(f'{0.145+0.713*float(k):.3f}' for k in sys.argv[1:]))
