package main;

import dao.*;
import model.*;

import java.sql.Date;
import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

public class AppPedido {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        PedidoDAO pedidoDAO = new PedidoDAO();
        ClienteDAO clienteDAO = new ClienteDAO();
        ProdutoDAO produtoDAO = new ProdutoDAO();
        ItemPedidoDAO itemDAO = new ItemPedidoDAO();
        int opcao;

        do {
            System.out.println("\n===== MENU PEDIDO =====");
            System.out.println("1 - Inserir pedido");
            System.out.println("2 - Listar pedidos");
            System.out.println("3 - Atualizar pedido");
            System.out.println("4 - Deletar pedido");
            System.out.println("0 - Voltar");
            System.out.print("Escolha: ");
            opcao = sc.nextInt();
            sc.nextLine();

            switch (opcao) {
                case 1 -> {
                    System.out.println("\n===== CADASTRO DE PEDIDO =====");

                    int clienteId;
                    while (true) {
                        System.out.print("CPF/CNPJ do cliente: ");
                        String doc = sc.nextLine().replaceAll("\\D", "");
                        try {
                            Cliente cliente = clienteDAO.buscarPorCpfCnpj(doc);
                            if (cliente == null || !cliente.isAtivo()) {
                                System.out.println("Cliente não encontrado ou inativo.");
                                continue;
                            }
                            clienteId = cliente.getId();
                            break;
                        } catch (SQLException e) {
                            System.out.println("Erro ao buscar cliente: " + e.getMessage());
                        }
                    }

                    Date dataRequisicao = null;
                    while (dataRequisicao == null) {
                        System.out.print("Data de requisição (YYYY-MM-DD): ");
                        try {
                            dataRequisicao = Date.valueOf(sc.nextLine());
                        } catch (Exception e) {
                            System.out.println("Data inválida.");
                        }
                    }

                    Date dataEntrega = null;
                    while (dataEntrega == null) {
                        System.out.print("Data de entrega (YYYY-MM-DD): ");
                        try {
                            dataEntrega = Date.valueOf(sc.nextLine());
                        } catch (Exception e) {
                            System.out.println("Data inválida.");
                        }
                    }

                    Pedido novo = new Pedido(0, dataRequisicao, dataEntrega, clienteId);
                    try {
                        pedidoDAO.inserir(novo);
                        System.out.println("✅ Pedido criado com sucesso!");
                    } catch (SQLException e) {
                        System.out.println("Erro ao inserir pedido: " + e.getMessage());
                        break;
                    }

                    adicionarItensPedido(sc, produtoDAO, itemDAO, novo.getId());
                }

                case 2 -> {
                    try {
                        List<Pedido> pedidos = pedidoDAO.listar();
                        if (pedidos.isEmpty()) {
                            System.out.println("Nenhum pedido encontrado.");
                        } else {
                            System.out.println("\n===== LISTA DE PEDIDOS =====");
                            for (Pedido p : pedidos) {
                                System.out.println(p);
                                List<ItemPedido> itens = itemDAO.listarPorPedido(p.getId());
                                for (ItemPedido item : itens) {
                                    System.out.println("  ↳ Produto ID: " + item.getProdutoId() + " | Quantidade: " + item.getQuantidade());
                                }
                            }
                        }
                    } catch (SQLException e) {
                        System.out.println("Erro ao listar pedidos: " + e.getMessage());
                    }
                }

                case 3 -> {
                    System.out.print("Digite o ID do pedido para atualizar: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    try {
                        Pedido atual = pedidoDAO.buscarPorId(id);
                        if (atual == null) {
                            System.out.println("Pedido não encontrado.");
                            break;
                        }

                        System.out.println("📝 Dados atuais do pedido:");
                        System.out.println(atual);

                        System.out.print("Nova data de requisição (" + atual.getDataRequisicao() + "): ");
                        String req = sc.nextLine();
                        if (!req.isBlank()) atual.setDataRequisicao(Date.valueOf(req));

                        System.out.print("Nova data de entrega (" + atual.getDataEntrega() + "): ");
                        String ent = sc.nextLine();
                        if (!ent.isBlank()) atual.setDataEntrega(Date.valueOf(ent));

                        pedidoDAO.atualizar(atual);
                        System.out.println("✅ Pedido atualizado!");

                        System.out.print("Deseja adicionar mais produtos ao pedido? (s/n): ");
                        String resp = sc.nextLine();
                        if (resp.equalsIgnoreCase("s")) {
                            adicionarItensPedido(sc, produtoDAO, itemDAO, atual.getId());
                        }

                    } catch (SQLException e) {
                        System.out.println("Erro: " + e.getMessage());
                    }
                }

                case 4 -> {
                    System.out.print("Digite o ID do pedido a deletar: ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    try {
                        pedidoDAO.deletar(id);
                        System.out.println("✅ Pedido deletado.");
                    } catch (SQLException e) {
                        System.out.println("Erro ao deletar pedido: " + e.getMessage());
                    }
                }

                case 0 -> System.out.println("Voltando...");
                default -> System.out.println("Opção inválida.");
            }

        } while (opcao != 0);
    }

    private static void adicionarItensPedido(Scanner sc, ProdutoDAO produtoDAO, ItemPedidoDAO itemDAO, int pedidoId) {
        boolean continuar = true;
        while (continuar) {
            try {
                System.out.println("\nProdutos disponíveis:");
                List<Produto> produtos = produtoDAO.listar();
                for (Produto p : produtos) {
                    System.out.println("ID: " + p.getId() + " | " + p.getNome());
                }

                System.out.print("ID do produto: ");
                int produtoId = sc.nextInt();
                sc.nextLine();

                System.out.print("Quantidade: ");
                int qtd = sc.nextInt();
                sc.nextLine();

                ItemPedido item = new ItemPedido(0, pedidoId, produtoId, qtd);
                itemDAO.inserir(item);
                System.out.println("✅ Item adicionado!");

                System.out.print("Adicionar outro produto? (s/n): ");
                String resp = sc.nextLine();
                if (!resp.equalsIgnoreCase("s")) continuar = false;

            } catch (Exception e) {
                System.out.println("Erro ao adicionar item: " + e.getMessage());
                sc.nextLine(); // limpa buffer
            }
        }
    }
}
