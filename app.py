from datetime import date
import json
from flask import Flask, Response, make_response, render_template, request, redirect, url_for, flash, session, send_from_directory
from psycopg2 import connect, OperationalError, errors
from dotenv import load_dotenv
import os
import psycopg2
from werkzeug.utils import secure_filename
import pdfkit


load_dotenv()

host = os.getenv('POSTGRES_LOCAL')
port = os.getenv('POSTGRES_PORT')
dbname = os.getenv('POSTGRES_DB')
username = os.getenv('POSTGRES_USER')
password = os.getenv('POSTGRES_PASSWORD')

conn = psycopg2.connect(host=host, port=port, dbname=dbname,user=username,password=password)

app = Flask(__name__)

app.secret_key = 'mysecretkey'

#LOGIN

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/cambio', methods=['POST'])
def cambioContrasena():
    try:
        if request.method == 'POST':

            codusu = request.form['user']
            newcontrasena = request.form['newcontrasena']
            cnewcontrasena = request.form['cnewcontrasena']

            if newcontrasena != cnewcontrasena:

                return redirect(url_for('home', tipo='warning'))

            else:

                cursor = conn.cursor()

                cursor.execute("""
                update usuarios 
                set contrasena = %s
               where usuario = %s
                """, (newcontrasena, codusu))

                conn.commit()

                flash('Cambio de Contraseña existosa !')
                return redirect(url_for('home', tipo='success'))

    except OperationalError as e:
        conn.rollback()
        flash('Error al insertar !')
        return redirect(url_for('home', tipo='error'))

    except errors.InvalidTextRepresentation as e:
        conn.rollback()
        flash('Error al insertar !')
        return redirect(url_for('home', tipo='error'))

@app.route('/login', methods=['GET', 'POST'])
def login():

    global conn

    try:

        if request.method == 'POST':

            username = request.form['user']
            password = request.form['password']

            cur = conn.cursor()

            sql = "SELECT usuario, password FROM personas WHERE usuario ='{0}'"
            cur.execute(sql.format(username))
            row = cur.fetchone()

            if row != None:

                sql1 = "SELECT usuario, password FROM personas WHERE usuario = '{0}' and password = '{1}'"
                cur.execute(sql1.format(username, password))
                row1 = cur.fetchone()

                if row1 != None:

                    sql2 = "SELECT usuario, password FROM personas WHERE usuario = '{0}' and password = '{1}'"
                    cur.execute(sql2.format(username, password))

                    session['user'] = request.form['user']

                    return redirect(url_for('home', tipo='success'))
                else:
                    flash("Clave Invalido ...")
                    return redirect(url_for('login', tipo='error'))
            else:
                flash("Usuario no existe ...")
                return redirect(url_for('login', tipo='error'))
        else:
            return render_template('login.html')

    except psycopg2.InterfaceError as err:

        conn = psycopg2.connect(host=host, port=port, dbname=dbname,user=username,password=password)
        cur = conn.cursor()
        cur.execute(query)

@app.route('/home')       
def home():
    #cursor = conn.cursor()

    #cursor.execute("WITH libroprimera AS (select count(*) as cantprimeracomu from libroprimeracomu), librobautismo AS (select count(*) as cantbautismo from librobautismo), libroconfirmacion AS (select count(*) as cantconfirmacion from libroconfirmacion), libromatrimonio AS (select count(*) as cantmatrimonio from libromatrimonio ) SELECT cantbautismo, cantprimeracomu, cantconfirmacion, cantmatrimonio FROM libroprimera, librobautismo, libroconfirmacion, libromatrimonio")
    #data = cursor.fetchall()

    #return render_template('home.html', libros=data)
    return render_template('home.html', inicio='home')


#PRODUCTOS

@app.route('/productos')
def producto():
    cursor = conn.cursor()

    cursor.execute("select p.producto, p.nombre, p.cantidad, (SELECT u.nombre FROM unidades u where u.unidad = p.unidad) as unidad, (SELECT m.nombre FROM marcas m where m.marca = p.marca) as marca, (SELECT c.nombre FROM categorias c where c.categoria = p.categoria) as categoria, preciocompra, precioventa from productos p")
    data = cursor.fetchall()

    cursor.execute("select categoria, nombre from categorias")
    data1 = cursor.fetchall()

    cursor.execute("select unidad, nombre from unidades")
    data2 = cursor.fetchall()

    cursor.execute("select marca, nombre from marcas")
    data3 = cursor.fetchall()

    return render_template('productos.html', productos = data, categorias = data1, unidades = data2, marcas = data3, inicio='producto')


@app.route('/productos/nuevo', methods=['POST'])
def nuevoProducto():
    try:
        if request.method == 'POST':
            txtNombre  = request.form['txtNombre']
            txtPrecio  = request.form['txtPrecio']
            txtStock   = request.form['txtStock']
            categoria1 = request.form['categoria1']

            cursor = conn.cursor()

            cursor.execute(
                "INSERT INTO public.productos(descripcion, precio, cantidad, estado, id_categoria) VALUES (%s,%s,%s,%s,%s)",
                (txtNombre, txtPrecio, txtStock, 1, categoria1))

            conn.commit()

            flash('Producto Agregado correctamente !')
            return redirect(url_for('productos', tipo='success'))

    except OperationalError as e:
        conn.rollback()
        flash('Error al insertar !')
        return redirect(url_for('productos', tipo='error'))

    except errors.InvalidTextRepresentation as e:
        conn.rollback()
        flash('Error al insertar !')
        return redirect(url_for('productos', tipo='error'))


@app.route('/producto', methods=['GET', 'POST'])
def editarProducto():
    codusu = request.form['codusu']

    cursor = conn.cursor()
    cursor.execute(
        "select codusu, nomyape, cedula, email, estado, clave, tipo from usuarios where codusu = '{0}'".format(codusu))
    usuarios = cursor.fetchall()

    blogs_dict = []
    for usuario in usuarios:
        blog_dict = {
            'codusu': usuario[0],
            'nomyape': usuario[1],
            'cedula': usuario[2],
            'email': usuario[3],
            'estado': usuario[4],
            'clave': usuario[5],
            'tipo': usuario[6]
        }
        blogs_dict.append(blog_dict)

    return json.dumps(blogs_dict, default=str)


@app.route('/productos/modifica', methods=['POST'])
def modificaProducto():
    try:
        if request.method == 'POST':
            codusu = request.form['codusu1']
            cedula = request.form['cedula1']
            nomyape = request.form['nomyape1']
            email = request.form['email1']
            estado = request.form['estado1']
            clave = request.form['clave1']
            tipo = request.form['tipo1']

            cursor = conn.cursor()

            cursor.execute("""
            update usuarios 
            set cedula = %s,
                nomyape = %s,
                email = %s,
                estado = %s,
               clave = %s,
               tipo = %s
           where codusu = %s
            """, (cedula, nomyape, email, estado, clave, tipo, codusu))

            conn.commit()

            flash('Usuario Editado correctamente !')
            return redirect(url_for('usuario', tipo='success'))

    except OperationalError as e:
        conn.rollback()
        flash('Error al modificar !')
        return redirect(url_for('usuario', tipo='error'))

    except errors.InvalidTextRepresentation as e:
        conn.rollback()
        flash('Error al modificar !')
        return redirect(url_for('usuario', tipo='error'))


@app.route('/productos/eliminar/<string:id>')
def eliminarProducto(id):
    try:
        cursor = conn.cursor()

        cursor.execute("delete from usuarios where codusu = '{0}'".format(id))

        conn.commit()

        flash('Usuario Eliminado correctamente !')
        return redirect(url_for('usuario', tipo='success'))

    except OperationalError as e:
        conn.rollback()
        flash('Error al eliminar !')
        return redirect(url_for('usuario', tipo='error'))

    except errors.InvalidTextRepresentation as e:
        conn.rollback()
        flash('Error al eliminar !')
        return redirect(url_for('usuario', tipo='error'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
