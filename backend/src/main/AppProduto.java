package main;

import dao.ProdutoDAO;
import model.Produto;

import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

public class AppProduto {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ProdutoDAO dao = new ProdutoDAO();
        int opcao;

        do {
            System.out.println("\n===== MÓDULO DE PRODUTOS =====");
            System.out.println("1 - Cadastrar novo produto");
            System.out.println("2 - Listar produtos");
            System.out.println("3 - Atualizar produto");
            System.out.println("4 - Deletar produto");
            System.out.println("0 - Voltar");
            System.out.print("Escolha: ");
            opcao = sc.nextInt();
            sc.nextLine();

            switch (opcao) {
                case 1 -> {
                    String nome, descricao, tipo;
                    double valor;

                    // Nome obrigatório
                    while (true) {
                        System.out.print("Nome do produto: ");
                        nome = sc.nextLine().trim();
                        if (nome.isEmpty()) {
                            System.out.println("⚠️ Nome é obrigatório.");
                        } else break;
                    }

                    System.out.print("Descrição (opcional): ");
                    descricao = sc.nextLine();

                    // Tipo obrigatório
                    while (true) {
                        tipo = escolherTipoProduto(sc);
                        if (tipo.equals("Outros")) {
                            System.out.println("⚠️ Tipo inválido. Escolha novamente.");
                        } else break;
                    }

                    // Valor obrigatório e válido
                    while (true) {
                        System.out.print("Valor unitário: ");
                        String entrada = sc.nextLine();
                        try {
                            valor = Double.parseDouble(entrada);
                            if (valor <= 0) {
                                System.out.println("⚠️ Valor deve ser maior que zero.");
                                continue;
                            }
                            break;
                        } catch (NumberFormatException e) {
                            System.out.println("❌ Valor inválido. Tente novamente.");
                        }
                    }

                    Produto novo = new Produto(0, nome, descricao, tipo, 0, valor);
                    try {
                        dao.inserir(novo);
                        System.out.println("✅ Produto cadastrado com sucesso!");
                    } catch (Exception e) {
                        System.out.println("Erro ao cadastrar produto: " + e.getMessage());
                    }
                }

                case 2 -> {
                    try {
                        List<Produto> lista = dao.listar();
                        if (lista.isEmpty()) {
                            System.out.println("⚠️ Não há nenhum produto listado ainda.");
                        } else {
                            System.out.println("\n📦 Lista de Produtos:");
                            for (Produto p : lista) {
                                System.out.printf("ID: %d | Nome: %s | Descrição: %s | Tipo: %s | Valor: R$ %.2f\n",
                                        p.getId(), p.getNome(), p.getDescricao(), p.getTipo(), p.getValor());
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("Erro ao listar produtos: " + e.getMessage());
                    }
                }

                case 3 -> {
                    System.out.print("Digite o ID do produto a atualizar: ");
                    int id = sc.nextInt();
                    sc.nextLine();

                    try {
                        Produto atual = dao.buscarPorId(id);
                        if (atual == null) {
                            System.out.println("❌ ID inválido. Informe um ID correto.");
                            break;
                        }

                        System.out.println("📝 Dados atuais do produto:");
                        System.out.println("Nome: " + atual.getNome());
                        System.out.println("Descrição: " + atual.getDescricao());
                        System.out.println("Tipo: " + atual.getTipo());
                        System.out.printf("Valor: R$ %.2f\n", atual.getValor());

                        System.out.print("Novo nome (ENTER para manter): ");
                        String nome = sc.nextLine();
                        if (nome.isEmpty()) nome = atual.getNome();

                        System.out.print("Nova descrição (ENTER para manter): ");
                        String descricao = sc.nextLine();
                        if (descricao.isEmpty()) descricao = atual.getDescricao();

                        System.out.println("Novo tipo:");
                        String tipo = escolherTipoProduto(sc);

                        double valor;
                        while (true) {
                            System.out.print("Novo valor unitário (ENTER para manter): ");
                            String entrada = sc.nextLine();
                            if (entrada.isEmpty()) {
                                valor = atual.getValor();
                                break;
                            }
                            try {
                                valor = Double.parseDouble(entrada);
                                break;
                            } catch (NumberFormatException e) {
                                System.out.println("❌ Valor inválido. Tente novamente.");
                            }
                        }

                        Produto atualizado = new Produto(id, nome, descricao, tipo, atual.getQuantidade(), valor);
                        dao.atualizar(atualizado);
                        System.out.println("✅ Produto atualizado com sucesso!");

                    } catch (Exception e) {
                        System.out.println("Erro ao atualizar produto: " + e.getMessage());
                    }
                }

                case 4 -> {
                    try {
                        List<Produto> lista = dao.listar();
                        if (lista.isEmpty()) {
                            System.out.println("⚠️ Nenhum produto para deletar.");
                            break;
                        }

                        System.out.println("\nProdutos disponíveis:");
                        for (Produto p : lista) {
                            System.out.println("ID: " + p.getId() + " | Nome: " + p.getNome());
                        }

                        System.out.print("Digite o ID do produto que deseja deletar: ");
                        int id = sc.nextInt();
                        sc.nextLine();

                        Produto encontrado = dao.buscarPorId(id);
                        if (encontrado != null) {
                            dao.deletar(id);
                            System.out.println("🗑️ Produto deletado com sucesso.");
                        } else {
                            System.out.println("❌ ID inexistente. Digite um ID válido.");
                        }

                    } catch (Exception e) {
                        System.out.println("Erro ao deletar produto: " + e.getMessage());
                    }
                }

                case 0 -> System.out.println("Voltando ao menu principal...");
                default -> System.out.println("Opção inválida!");
            }

        } while (opcao != 0);
    }

    private static String escolherTipoProduto(Scanner sc) {
        System.out.println("Selecione o tipo de produto:");
        System.out.println("1 - Adubo e Substratos");
        System.out.println("2 - Vasos e Acessórios");
        System.out.println("3 - Plantas e Arranjos");
        System.out.println("4 - Ferramentas de Jardinagem");
        System.out.println("5 - Produtos Naturais");
        System.out.print("Opção: ");
        int tipoEscolhido = sc.nextInt();
        sc.nextLine();

        return switch (tipoEscolhido) {
            case 1 -> "Adubo e Substratos";
            case 2 -> "Vasos e Acessórios";
            case 3 -> "Plantas e Arranjos";
            case 4 -> "Ferramentas de Jardinagem";
            case 5 -> "Produtos Naturais";
            default -> {
                System.out.println("Tipo inválido. Tipo definido como 'Outros'.");
                yield "Outros";
            }
        };
    }
}
