#import pdfplumber
import pymupdf
#import pandas as pd
import re
import json

def import_pdf(path_to_pdf):
    """Import a pdf and transform it into string

    Args:
        path_to_pdf (str): a path to the file

    Returns:
        str: all text in the pdf
    """
    doc = pymupdf.open(path_to_pdf)  # open a document
    text = ""
    for page in doc:  # iterate the document pages
        text += page.get_text() # ne pas strip car supprime les \n
    return text

def sep_segment(book_string: str):
    """Separate a interactive fiction's string into pieces

    Args:
        book_string (str): the interactive fiction's string

    Returns:
        dict: a dictionnary with segments's index as key and the segment's text
    """
    book_string = book_string
    regex_sep = re.compile(r"(?<=\n)\s*(\d+)\s*\n")
    print(regex_sep)
    matching_passage = re.findall(regex_sep, book_string)

    # Remove false passage number
    for index, value in enumerate(matching_passage):
        if index + 1 != int(value):
            print(f"Index {index} is not matching with value {value}")
            print(f"Element popped from {matching_passage.pop(index)}")
    passages = {}
    for index, value in enumerate(matching_passage):
        if value != matching_passage[-1]:
            regex_text = re.compile(r"(?<=\n)\s*"+ value +r"\s*\n((.+\n)+?)\s*" + f"{int(value)+1}")
        else :
            regex_text = re.compile(r"(?<=\n)\s*" + value + r"\s+((.+\n)+)\s*\d*\s+")
        if re.search(regex_text, book_string):
            passages[value] = {"text" : re.search(regex_text, book_string).group(1)}
        else:
            print(f"Error : {value}")
            passages[value] = {"text" : ""}
    return passages



def parse_data(book_string: str):
    pass
    """book_string = book_string.lower()
    regex_defi_link = re.compile(r"rendez[ -]vous .+(\d+)")"""

bonjour = import_pdf("Le manoir de lenfer.pdf")
print(bonjour)
salut = sep_segment(bonjour)
json_object = json.dumps(salut, indent=4)
print(json_object)
