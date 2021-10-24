const express = require("express")
const cors = require('cors');

const clients = []
let isAproved = false

const server = express()

server
    .use(cors())
    .use(express.json())

    .post('/simulator', (req, res) => {
        const { value, deadline } = req.body
        let finalValue = 0
        let monthly = 0
        let porcent

        if (value < 5000 || value) {
            isAproved = false
            return res.status(400).json({ error: "O valor mínimo para emprestimo é de R$: 5.000,00 " });
        }
        if (value > 10000) {
            isAproved = false
            return res.status(400).json({ error: "O valor máximo para o emprestimo é de R$: 10.000,00 " });
        }

        if (deadline < 0) {
            return res.status(400).json({ error: "Não é possivel realizar um emprestimo com um prazo negativo" });

        }

        isAproved = true

        porcent = value * 0.01;

        finalValue = porcent * deadline

        finalValue += value

        monthly = finalValue / deadline

        var formatedFinalValue = finalValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

        return res.status(200).json({ "Prazo": `${deadline} Meses`, "Valor da parcela": monthly.toFixed(2), "Valor concedido com 1% de juros ao mês": formatedFinalValue })
    })


    .post('/contract', async (req, res) => {
        const { name, email } = req.body

        const client = await clients.find(user => user.email === email);

        if (client) {
            return res.status(404).json({ error: "Usuário já existe" });
        }

        if (isAproved === false) {
            return res.status(400).json({ error: "O empréstimo deste usuário não foi aprovado" })
        }

        clients.push({ name, email })

        return res.status(201).json("Criado com sucesso")

    })

    .get('/clients', (req, res) => {
        return res.status(200).json(clients)
    })

    .get('/clients/by/:email', async (req, res) => {
        const { email } = req.params

        const clientByEmail = await clients.find(client => client.email === email)

        if (!clientByEmail) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }


        return res.status(200).json(clientByEmail)
    })


const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log("servidor rodando")
});