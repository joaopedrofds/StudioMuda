package main;

import dao.FuncionarioDAO;
import model.Funcionario;
import utils.ValidarCPF;

import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

public class AppFuncionario {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        FuncionarioDAO dao = new FuncionarioDAO();
        int opcao;

        do {
            System.out.println("\n===== MENU FUNCIONÁRIO =====");
            System.out.println("1 - Inserir funcionário");
            System.out.println("2 - Listar funcionários");
            System.out.println("3 - Atualizar funcionário");
            System.out.println("4 - Deletar funcionário");
            System.out.println("0 - Voltar");
            System.out.print("Escolha: ");

            if (sc.hasNextInt()) {
                opcao = sc.nextInt();
                sc.nextLine();
            } else {
                System.out.println("Opção inválida!");
                sc.nextLine();
                opcao = -1;
            }

            switch (opcao) {
                case 1 -> {
                    System.out.println("\n===== CADASTRO DE FUNCIONÁRIO =====");
                    String cpf;

                    while (true) {
                        System.out.print("CPF (apenas números): ");
                        cpf = sc.nextLine().replaceAll("[^\\d]", "");

                        if (cpf.length() != 11) {
                            System.out.println("❌ CPF deve ter 11 dígitos. Tente novamente.");
                            continue;
                        }

                        if (!ValidarCPF.isCPF(cpf)) {
                            System.out.println("❌ CPF inválido. Tente novamente.");
                            continue;
                        }

                        try {
                            Funcionario existente = dao.buscarPorCpf(cpf);
                            if (existente != null) {
                                System.out.println("Funcionário já cadastrado:");
                                System.out.println(existente);
                                System.out.println("❌ CPF já utilizado. Por favor, digite um CPF diferente.");
                                continue;
                            }
                        } catch (SQLException e) {
                            System.out.println("Erro ao verificar CPF: " + e.getMessage());
                            continue;
                        }

                        break;
                    }

                    System.out.print("Nome: ");
                    String nome = sc.nextLine();

                    System.out.print("Data de nascimento (YYYY-MM-DD): ");
                    String dataNasc = sc.nextLine();

                    String telefone;
                    while (true) {
                        System.out.print("Telefone (somente números com DDD): ");
                        telefone = sc.nextLine().replaceAll("[^\\d]", "");
                        if (telefone.length() != 11) {
                            System.out.println("❌ Telefone deve ter exatamente 11 dígitos. Tente novamente.");
                        } else break;
                    }

                    System.out.print("CEP: ");
                    String cep = sc.nextLine();

                    System.out.print("Rua: ");
                    String rua = sc.nextLine();

                    System.out.print("Número: ");
                    String numero = sc.nextLine();

                    System.out.print("Bairro: ");
                    String bairro = sc.nextLine();

                    System.out.print("Cidade: ");
                    String cidade = sc.nextLine();

                    System.out.print("Estado (UF): ");
                    String estado = sc.nextLine();

                    String cargo = "";
                    while (true) {
                        System.out.println("Selecione o cargo:");
                        System.out.println("1 - Diretor");
                        System.out.println("2 - Auxiliar");
                        System.out.println("3 - Estoquista");
                        System.out.print("Opção: ");
                        String op = sc.nextLine();

                        switch (op) {
                            case "1" -> {
                                cargo = "Diretor";
                                break;
                            }
                            case "2" -> {
                                cargo = "Auxiliar";
                                break;
                            }
                            case "3" -> {
                                cargo = "Estoquista";
                                break;
                            }
                            default -> {
                                System.out.println("Opção inválida. Tente novamente.");
                                continue;
                            }
                        }
                        break;
                    }

                    Funcionario novo = new Funcionario(0, nome, cpf, cargo, dataNasc, telefone,
                            cep, rua, numero, bairro, cidade, estado, true);

                    try {
                        dao.inserir(novo);
                        System.out.println("✅ Funcionário cadastrado com sucesso!");
                    } catch (SQLException e) {
                        System.out.println("Erro ao inserir funcionário: " + e.getMessage());
                    }
                }

                case 2 -> {
                    try {
                        List<Funcionario> lista = dao.listar();
                        List<Funcionario> ativos = lista.stream().filter(Funcionario::isAtivo).toList();
                        List<Funcionario> inativos = lista.stream().filter(f -> !f.isAtivo()).toList();

                        if (lista.isEmpty()) {
                            System.out.println("Nenhum funcionário cadastrado.");
                        } else {
                            System.out.println("\n===== FUNCIONÁRIOS ATIVOS =====");
                            for (Funcionario f : ativos) {
                                System.out.println(f);
                            }
                            System.out.println("\n===== FUNCIONÁRIOS INATIVOS =====");
                            for (Funcionario f : inativos) {
                                System.out.println(f);
                            }
                        }
                    } catch (SQLException e) {
                        System.out.println("Erro ao listar funcionários: " + e.getMessage());
                    }
                }

                case 3 -> {
                    System.out.print("Digite o CPF do funcionário a atualizar: ");
                    String cpf = sc.nextLine().replaceAll("[^\\d]", "");

                    try {
                        Funcionario atual = dao.buscarPorCpf(cpf);
                        if (atual == null) {
                            System.out.println("Funcionário não encontrado.");
                            break;
                        }

                        if (!atual.isAtivo()) {
                            System.out.println("⚠️ Funcionário está inativo.");
                            System.out.print("Deseja reativar o cadastro? (S/N): ");
                            String resp = sc.nextLine().trim().toUpperCase();
                            if (resp.equals("S")) {
                                atual.setAtivo(true);
                                dao.atualizar(atual);
                                System.out.println("✅ Funcionário reativado!");
                            } else {
                                System.out.println("🔁 Retornando ao menu...");
                                break;
                            }
                        }

                        System.out.println("📝 Dados atuais:");
                        System.out.println(atual);

                        System.out.print("Novo telefone (" + atual.getTelefone() + "): ");
                        String telefone = sc.nextLine().replaceAll("[^\\d]", "");
                        if (!telefone.isEmpty() && telefone.length() == 11) {
                            atual.setTelefone(telefone);
                        }

                        System.out.print("Novo CEP (" + atual.getCep() + "): ");
                        String cep = sc.nextLine();
                        if (!cep.isEmpty()) atual.setCep(cep);

                        System.out.print("Nova rua (" + atual.getRua() + "): ");
                        String rua = sc.nextLine();
                        if (!rua.isEmpty()) atual.setRua(rua);

                        System.out.print("Novo número (" + atual.getNumero() + "): ");
                        String numero = sc.nextLine();
                        if (!numero.isEmpty()) atual.setNumero(numero);

                        System.out.print("Novo bairro (" + atual.getBairro() + "): ");
                        String bairro = sc.nextLine();
                        if (!bairro.isEmpty()) atual.setBairro(bairro);

                        System.out.print("Nova cidade (" + atual.getCidade() + "): ");
                        String cidade = sc.nextLine();
                        if (!cidade.isEmpty()) atual.setCidade(cidade);

                        System.out.print("Novo estado (" + atual.getEstado() + "): ");
                        String estado = sc.nextLine();
                        if (!estado.isEmpty()) atual.setEstado(estado);

                        System.out.println("Novo cargo (" + atual.getCargo() + "):");
                        System.out.println("1 - Diretor | 2 - Auxiliar | 3 - Estoquista | ENTER para manter");
                        String op = sc.nextLine();
                        switch (op) {
                            case "1" -> atual.setCargo("Diretor");
                            case "2" -> atual.setCargo("Auxiliar");
                            case "3" -> atual.setCargo("Estoquista");
                        }

                        dao.atualizar(atual);
                        System.out.println("✅ Funcionário atualizado com sucesso!");
                    } catch (SQLException e) {
                        System.out.println("Erro ao atualizar funcionário: " + e.getMessage());
                    }
                }

                case 4 -> {
                    System.out.print("Digite o CPF do funcionário a deletar: ");
                    String cpf = sc.nextLine().replaceAll("[^\\d]", "");
                    try {
                        dao.deletar(cpf);
                        System.out.println("✅ Funcionário deletado (inativado) com sucesso!");
                    } catch (SQLException e) {
                        System.out.println("Erro ao deletar funcionário: " + e.getMessage());
                    }
                }

                case 0 -> System.out.println("Voltando ao menu principal...");
                default -> System.out.println("Opção inválida!");
            }

        } while (opcao != 0);
    }
}
