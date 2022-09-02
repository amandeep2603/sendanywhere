
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
import json
import os
import uuid 


def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]
             
        
def fileupload(code ,file):
    uid = uuid.uuid4()
    myfile = str(uid)+'_'+file.name 

    with open(os.path.join("E:\\sendanywhere\\frontend\\public\\uploads\\"+myfile), 'wb+') as destination:
            for chunk in file.chunks():  
                destination.write(chunk)

    with connection.cursor() as cursor:
        insertQuery = 'insert into store(file, code) values(%s , %s)'
        cursor.execute(insertQuery, [myfile, code])

    return {'file':myfile, 'code':code}



@api_view(['GET', 'POST'])
def uploadfile(request):
    if request.method == 'POST':
        try:
            code = request.POST.get('code')
            file = request.FILES.get('file')
            result = fileupload(code, file)
            return Response({'data':result, 'errorMessage':"", 'status':1})
        except:
            return Response({'data':[], 'errorMessage':"Something went wrong", 'status':0})
            

    return Response({'msg':'hello'})


def filedelete(code):
    with connection.cursor() as cursor:
        cursor.execute('select * from store where code=%s', [code])
        row = cursor.fetchone()

    file_path = os.path.join('E:\\sendanywhere\\frontend\\public\\uploads\\',row[1])
    os.remove(file_path)

    with connection.cursor() as cursor:
        cursor.execute('delete from store where code=%s',[code])
    

@api_view(['DELETE'])
def deletefile(request , pk):
    try:
        code = pk
        filedelete(code)
        return Response({'data':[], 'errorMessage':"", 'status':1})    
    except :
        return Response({'data':[], 'errorMessage':"file maybe deleted from server" , 'status':0})


def filedownload(code):
    with connection.cursor() as cursor:
        cursor.execute('select * from store where code=%s', [code])
        row = cursor.fetchone()
    return {'file':row[1]}


@api_view(['GET'])
def downloadfile(request,pk):
    try:
        code = pk
        result = filedownload(code)
        return Response({'data':result, 'errorMessage':"", 'status':1})    
    except :
        return Response({'data':[], 'errorMessage':"Incorrect code" , 'status':0})

