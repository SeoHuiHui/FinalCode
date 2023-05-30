import string
import random

def makePw(self):
    letters_set = string.ascii_lowercase + string.digits
    random_list = random.sample(letters_set,5)
    result = ''.join(random_list)
    return result