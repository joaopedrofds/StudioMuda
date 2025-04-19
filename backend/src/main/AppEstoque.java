package main;

import dao.MovimentacaoEstoqueDAO;
import dao.ProdutoDAO;
import model.MovimentacaoEstoque;
import model.Produto;

import java.sql.Date;
import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

public class AppEstoque {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        MovimentacaoEstoqueDAO dao = new MovimentacaoEstoqueDAO();
        ProdutoDAO produtoDAO = new ProdutoDAO();
        int opcao;

        do {
            System.out.println("\n===== MENU ESTOQUE =====");
            System.out.println("1 - Registrar entrada ou saída de produto");
            System.out.println("2 - Listar movimentações");
            System.out.println("3 - Atualizar movimentação");
            System.out.println("4 - Deletar movimentação");
            System.out.println("0 - Voltar");
            System.out.print("Escolha: ");
            opcao = sc.nextInt();
            sc.nextLine();

            switch (opcao) {
                case 1 -> {
                    try {
                        List<Produto> produtos = produtoDAO.listar();
                        if (produtos.isEmpty()) {
                            System.out.println("Nenhum produto cadastrado.");
                            break;
                        }

                        System.out.println("\n📦 Produtos disponíveis:");
                        for (Produto p : produtos) {
                            System.out.printf("ID do produto: %d | Nome: %s | Estoque: %d\n", p.getId(), p.getNome(), p.getQuantidade());
                        }

                        System.out.print("ID do produto (ou 0 para voltar): ");
                        int idProduto = sc.nextInt();
                        sc.nextLine();
                        if (idProduto == 0) break;

                        Produto produto = produtoDAO.buscarPorId(idProduto);
                        if (produto == null) {
                            System.out.println("Produto não encontrado.");
                            break;
                        }

                        String tipo = null;
                        while (true) {
                            System.out.print("Tipo da movimentação (E = entrada | S = saída | 0 = voltar): ");
                            String entradaTipo = sc.nextLine().trim().toUpperCase();
                            if (entradaTipo.equals("0")) {
                                break;
                            } else if (entradaTipo.equals("E")) {
                                tipo = "entrada";
                                break;
                            } else if (entradaTipo.equals("S")) {
                                tipo = "saida";
                                break;
                            } else {
                                System.out.println("❌ Tipo inválido. Digite apenas E ou S.");
                            }
                        }

                        if (tipo == null) break; // se escolheu voltar


                        System.out.print("Quantidade (ou 0 para voltar): ");
                        int qtd = sc.nextInt();
                        sc.nextLine();
                        if (qtd == 0) break;

                        if (qtd <= 0) {
                            System.out.println("❌ Quantidade deve ser positiva.");
                            break;
                        }

                        if (tipo.equals("saida") && produto.getQuantidade() < qtd) {
                            System.out.println("❌ Estoque insuficiente.");
                            break;
                        }

                        System.out.print("Motivo: ");
                        String motivo = sc.nextLine();

                        Date data = new Date(System.currentTimeMillis());

                        MovimentacaoEstoque mov = new MovimentacaoEstoque(0, idProduto, tipo, qtd, motivo, data);
                        dao.registrar(mov);
                        System.out.println("✅ Movimentação registrada!");
                    } catch (SQLException e) {
                        System.out.println("Erro ao registrar movimentação: " + e.getMessage());
                    }
                }

                case 2 -> {
                    try {
                        System.out.println("\n📊 Qual tipo de movimentação deseja listar?");
                        System.out.println("1 - Somente entradas");
                        System.out.println("2 - Somente saídas");
                        System.out.println("3 - Todas");
                        System.out.println("0 - Voltar");
                        System.out.print("Escolha: ");
                        String filtro;
                        while (true) {
                            System.out.print("Escolha: ");
                            filtro = sc.nextLine().trim();

                            if (filtro.equals("0") || filtro.equals("1") || filtro.equals("2") || filtro.equals("3")) {
                                break;
                            } else {
                                System.out.println("❌ Opção inválida. Digite 1, 2, 3 ou 0.");
                            }
                        }

                        if (filtro.equals("0")) break;

                        List<MovimentacaoEstoque> lista = dao.listar();
                        if (lista.isEmpty()) {
                            System.out.println("Nenhuma movimentação encontrada.");
                            break;
                        }

                        System.out.println("\n📦 Lista de movimentações:");
                        for (MovimentacaoEstoque m : lista) {
                            if (filtro.equals("1") && m.getTipo().equalsIgnoreCase("entrada")) {
                                System.out.println(m);
                            } else if (filtro.equals("2") && m.getTipo().equalsIgnoreCase("saida")) {
                                System.out.println(m);
                            } else if (filtro.equals("3")) {
                                System.out.println(m);
                            }
                        }
                    } catch (SQLException e) {
                        System.out.println("Erro ao listar: " + e.getMessage());
                    }
                }

                case 3 -> {
                    System.out.print("ID da movimentação a atualizar (ou 0 para voltar): ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    if (id == 0) break;

                    try {
                        MovimentacaoEstoque mov = dao.buscarPorId(id);
                        if (mov == null) {
                            System.out.println("Movimentação não encontrada.");
                            break;
                        }

                        System.out.println("📝 Dados atuais:");
                        System.out.println(mov);

                        System.out.print("Novo motivo (ENTER para manter): ");
                        String motivo = sc.nextLine();
                        if (!motivo.isEmpty()) mov.setMotivo(motivo);

                        System.out.print("Nova data (YYYY-MM-DD ou ENTER para manter): ");
                        String dataInput = sc.nextLine();
                        if (!dataInput.isEmpty()) {
                            try {
                                mov.setData(Date.valueOf(dataInput));
                            } catch (Exception e) {
                                System.out.println("Data inválida. Mantida atual.");
                            }
                        }

                        dao.atualizar(mov);
                        System.out.println("✅ Movimentação atualizada!");
                    } catch (SQLException e) {
                        System.out.println("Erro ao atualizar: " + e.getMessage());
                    }
                }

                case 4 -> {
                    System.out.print("ID da movimentação a deletar (ou 0 para voltar): ");
                    int id = sc.nextInt();
                    sc.nextLine();
                    if (id == 0) break;

                    try {
                        MovimentacaoEstoque mov = dao.buscarPorId(id);
                        if (mov == null) {
                            System.out.println("Movimentação não encontrada.");
                            break;
                        }

                        dao.deletar(id);
                        System.out.println("🗑 Movimentação deletada com sucesso!");
                    } catch (SQLException e) {
                        System.out.println("Erro ao deletar: " + e.getMessage());
                    }
                }

                case 0 -> System.out.println("Voltando ao menu principal...");
                default -> System.out.println("Opção inválida.");
            }

        } while (opcao != 0);
    }
}
