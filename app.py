from flask import Flask, render_template, request, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='estoque',
            user='root',
            password='1234'
        )
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/produtos', methods=['GET'])
def get_produtos():
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM produtos")
        produtos = cursor.fetchall()
        return jsonify(produtos)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/produtos', methods=['POST'])
def add_produto():
    data = request.json
    nome = data.get('nome')
    descricao = data.get('descricao')
    quantidade = data.get('quantidade')
    preco = data.get('preco')
    fornecedor = data.get('fornecedor')

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("""
            INSERT INTO produtos (nome, descricao, quantidade, preco, fornecedor) 
            VALUES (%s, %s, %s, %s, %s)
        """, (nome, descricao, quantidade, preco, fornecedor))
        connection.commit()
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM produtos WHERE id = %s", (new_id,))
        new_produto = cursor.fetchone()
        return jsonify(new_produto)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/venda', methods=['POST'])
def vender_produto():
    venda = request.json
    produto_id = venda.get('id')
    quantidade_venda = venda.get('quantidade')

    if quantidade_venda <= 0:
        return jsonify({"error": "Quantidade inválida"}), 400

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT quantidade FROM produtos WHERE id = %s", (produto_id,))
        produto = cursor.fetchone()
        if produto and produto['quantidade'] >= quantidade_venda:
            nova_quantidade = produto['quantidade'] - quantidade_venda
            cursor.execute("UPDATE produtos SET quantidade = %s WHERE id = %s", (nova_quantidade, produto_id))
            connection.commit()
            return jsonify({"success": True, "nova_quantidade": nova_quantidade}), 200
        elif produto:
            return jsonify({"error": "Quantidade insuficiente"}), 400
        else:
            return jsonify({"error": "Produto não encontrado"}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/produtos/<int:id>', methods=['DELETE'])
def delete_produto(id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("DELETE FROM produtos WHERE id = %s", (id,))
        connection.commit()
        if cursor.rowcount > 0:
            return '', 204
        else:
            return jsonify({"error": "Produto não encontrado"}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/produtos/<int:id>/preco', methods=['PUT'])
def update_preco(id):
    data = request.json
    novo_preco = data.get('preco')

    if novo_preco <= 0:
        return jsonify({"error": "Preço inválido"}), 400

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("UPDATE produtos SET preco = %s WHERE id = %s", (novo_preco, id))
        connection.commit()
        if cursor.rowcount > 0:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"error": "Produto não encontrado"}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/produtos/<int:id>/quantidade', methods=['PUT'])
def update_quantidade(id):
    data = request.json
    nova_quantidade = data.get('quantidade')

    if nova_quantidade < 0:
        return jsonify({"error": "Quantidade inválida"}), 400

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("UPDATE produtos SET quantidade = %s WHERE id = %s", (nova_quantidade, id))
        connection.commit()
        if cursor.rowcount > 0:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"error": "Produto não encontrado"}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(debug=True)
