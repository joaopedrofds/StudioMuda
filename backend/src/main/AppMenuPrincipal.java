package main;

import java.util.Scanner;

public class AppMenuPrincipal {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int opcao;

        do {
            System.out.println("\n===== MENU PRINCIPAL - STUDIO MUDA =====");
            System.out.println("1 - Módulo de Produtos");
            System.out.println("2 - Módulo de Funcionários");
            System.out.println("3 - Módulo de Clientes");
            System.out.println("4 - Módulo de Pedidos");
            System.out.println("5 - Módulo de Estoque");
            System.out.println("0 - Sair");
            System.out.print("Escolha: ");

            if (sc.hasNextInt()) {
                opcao = sc.nextInt();
                sc.nextLine();
            } else {
                System.out.println("Entrada inválida!");
                sc.nextLine();
                opcao = -1;
            }

            switch (opcao) {
                case 1 -> AppProduto.main(null);
                case 2 -> AppFuncionario.main(null);
                case 3 -> AppCliente.main(null);
                case 4 -> AppPedido.main(null);
                case 5 -> AppEstoque.main(null);
                case 0 -> System.out.println("Encerrando o sistema...");
                default -> System.out.println("Opção inválida!");
            }

        } while (opcao != 0);
    }
}
