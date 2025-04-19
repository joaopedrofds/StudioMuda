package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import conexao.Conexao;
import dao.EstoqueDAO;
import dao.MovimentacaoEstoqueDAO;
import model.Estoque;
import model.MovimentacaoEstoque;

@WebServlet("/api/estoque/*")
public class EstoqueServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private EstoqueDAO estoqueDAO;
    private MovimentacaoEstoqueDAO movimentacaoDAO;
    private Gson gson = new Gson();

    public EstoqueServlet() {
        super();
    }

    @Override
    public void init() throws ServletException {
        super.init();
        try {
            // Inicializa os DAOs com uma conexão
            Connection conn = Conexao.getConnection();
            estoqueDAO = new EstoqueDAO(conn);
            movimentacaoDAO = new MovimentacaoEstoqueDAO(conn);
        } catch (SQLException e) {
            throw new ServletException("Erro ao inicializar EstoqueServlet", e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Configura o tipo de retorno como JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Permite requisições de origens diferentes (CORS)
        response.setHeader("Access-Control-Allow-Origin", "*");

        try (PrintWriter out = response.getWriter()) {
            String pathInfo = request.getPathInfo();
            
            if (pathInfo == null || pathInfo.equals("/")) {
                // Lista a situação atual do estoque de todos os produtos
                List<Estoque> estoqueList = estoqueDAO.listarSituacaoAtual();
                String estoqueJson = gson.toJson(estoqueList);
                out.println(estoqueJson);
            } else if (pathInfo.equals("/baixo")) {
                // Lista produtos com estoque baixo
                List<Estoque> estoqueBaixo = estoqueDAO.listarEstoqueBaixo();
                String estoqueBaixoJson = gson.toJson(estoqueBaixo);
                out.println(estoqueBaixoJson);
            } else if (pathInfo.startsWith("/produto/")) {
                // Obtém estoque de um produto específico
                String[] urlParts = pathInfo.split("/");
                if (urlParts.length > 2) {
                    String idPart = urlParts[2];
                    try {
                        int produtoId = Integer.parseInt(idPart);
                        Estoque estoque = estoqueDAO.buscarPorProdutoId(produtoId);
                        
                        if (estoque != null) {
                            String estoqueJson = gson.toJson(estoque);
                            out.println(estoqueJson);
                        } else {
                            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                            out.println("{\"error\": \"Estoque não encontrado para o produto informado\"}");
                        }
                    } catch (NumberFormatException e) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.println("{\"error\": \"ID do produto inválido\"}");
                    }
                }
            } else if (pathInfo.equals("/movimentacoes")) {
                // Lista histórico de movimentações
                List<MovimentacaoEstoque> movimentacoes = movimentacaoDAO.listarTodas();
                String movimentacoesJson = gson.toJson(movimentacoes);
                out.println(movimentacoesJson);
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            PrintWriter out = response.getWriter();
            out.println("{\"error\": \"Erro ao consultar estoque: " + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Configura o tipo de retorno como JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Permite requisições de origens diferentes (CORS)
        response.setHeader("Access-Control-Allow-Origin", "*");

        String pathInfo = request.getPathInfo();
        
        try {
            // Lê o corpo da requisição
            StringBuilder buffer = new StringBuilder();
            String line;
            try (java.io.BufferedReader reader = request.getReader()) {
                while ((line = reader.readLine()) != null) {
                    buffer.append(line);
                }
            }
            
            if (pathInfo != null && pathInfo.equals("/entrada")) {
                // Registrar entrada de estoque
                MovimentacaoEstoque movimentacao = gson.fromJson(buffer.toString(), MovimentacaoEstoque.class);
                movimentacao.setTipo("E"); // Garantir que é uma entrada
                
                boolean sucesso = movimentacaoDAO.registrarMovimentacao(movimentacao);
                
                PrintWriter out = response.getWriter();
                if (sucesso) {
                    response.setStatus(HttpServletResponse.SC_CREATED);
                    out.println("{\"message\": \"Entrada registrada com sucesso\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.println("{\"error\": \"Erro ao registrar entrada\"}");
                }
            } else if (pathInfo != null && pathInfo.equals("/saida")) {
                // Registrar saída de estoque
                MovimentacaoEstoque movimentacao = gson.fromJson(buffer.toString(), MovimentacaoEstoque.class);
                movimentacao.setTipo("S"); // Garantir que é uma saída
                
                // Verificar se há estoque suficiente
                Estoque estoque = estoqueDAO.buscarPorProdutoId(movimentacao.getProdutoId());
                if (estoque == null || estoque.getQuantidadeDisponivel() < movimentacao.getQuantidade()) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    PrintWriter out = response.getWriter();
                    out.println("{\"error\": \"Quantidade insuficiente em estoque\"}");
                    return;
                }
                
                boolean sucesso = movimentacaoDAO.registrarMovimentacao(movimentacao);
                
                PrintWriter out = response.getWriter();
                if (sucesso) {
                    response.setStatus(HttpServletResponse.SC_CREATED);
                    out.println("{\"message\": \"Saída registrada com sucesso\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.println("{\"error\": \"Erro ao registrar saída\"}");
                }
            } else if (pathInfo != null && pathInfo.equals("/solicitacao")) {
                // Registrar solicitação de retirada
                JsonObject jsonObject = gson.fromJson(buffer.toString(), JsonObject.class);
                int produtoId = jsonObject.get("produtoId").getAsInt();
                int quantidade = jsonObject.get("quantidade").getAsInt();
                String auxiliar = jsonObject.get("auxiliar").getAsString();
                String observacao = jsonObject.has("observacao") ? jsonObject.get("observacao").getAsString() : "";
                
                // Em um ambiente real, você salvaria isso em uma tabela de solicitações
                // Por simplicidade, vamos apenas retornar sucesso
                
                PrintWriter out = response.getWriter();
                response.setStatus(HttpServletResponse.SC_CREATED);
                out.println("{\"message\": \"Solicitação registrada com sucesso\", \"id\": 1}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            PrintWriter out = response.getWriter();
            out.println("{\"error\": \"Erro ao processar requisição: " + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPatch(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Configura o tipo de retorno como JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Permite requisições de origens diferentes (CORS)
        response.setHeader("Access-Control-Allow-Origin", "*");

        String pathInfo = request.getPathInfo();
        PrintWriter out = response.getWriter();
        
        if (pathInfo != null && pathInfo.startsWith("/produto/") && pathInfo.endsWith("/minimo")) {
            try {
                // Extrai o ID do produto do path
                String[] urlParts = pathInfo.split("/");
                if (urlParts.length > 2) {
                    String idPart = urlParts[2];
                    try {
                        int produtoId = Integer.parseInt(idPart);
                        
                        // Lê o corpo da requisição
                        StringBuilder buffer = new StringBuilder();
                        String line;
                        try (java.io.BufferedReader reader = request.getReader()) {
                            while ((line = reader.readLine()) != null) {
                                buffer.append(line);
                            }
                        }
                        
                        // Extrai o estoque mínimo
                        JsonObject jsonObject = gson.fromJson(buffer.toString(), JsonObject.class);
                        int estoqueMinimo = jsonObject.get("estoqueMinimo").getAsInt();
                        
                        // Atualiza o estoque mínimo
                        boolean sucesso = estoqueDAO.atualizarEstoqueMinimo(produtoId, estoqueMinimo);
                        
                        if (sucesso) {
                            out.println("{\"message\": \"Estoque mínimo atualizado com sucesso\"}");
                        } else {
                            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                            out.println("{\"error\": \"Erro ao atualizar estoque mínimo\"}");
                        }
                    } catch (NumberFormatException e) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.println("{\"error\": \"ID do produto inválido\"}");
                    }
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("{\"error\": \"Erro ao processar requisição: " + e.getMessage() + "\"}");
            }
        } else if (pathInfo != null && pathInfo.startsWith("/solicitacoes/") && pathInfo.endsWith("/aprovar")) {
            try {
                // Extrai o ID da solicitação do path
                String[] urlParts = pathInfo.split("/");
                if (urlParts.length > 2) {
                    String idPart = urlParts[2];
                    try {
                        int solicitacaoId = Integer.parseInt(idPart);
                        
                        // Em um ambiente real, você aprovaria a solicitação no banco
                        // Por simplicidade, vamos apenas retornar sucesso
                        
                        out.println("{\"message\": \"Solicitação aprovada com sucesso\"}");
                    } catch (NumberFormatException e) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.println("{\"error\": \"ID da solicitação inválido\"}");
                    }
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("{\"error\": \"Erro ao processar requisição: " + e.getMessage() + "\"}");
            }
        } else if (pathInfo != null && pathInfo.startsWith("/solicitacoes/") && pathInfo.endsWith("/rejeitar")) {
            try {
                // Extrai o ID da solicitação do path
                String[] urlParts = pathInfo.split("/");
                if (urlParts.length > 2) {
                    String idPart = urlParts[2];
                    try {
                        int solicitacaoId = Integer.parseInt(idPart);
                        
                        // Lê o corpo da requisição
                        StringBuilder buffer = new StringBuilder();
                        String line;
                        try (java.io.BufferedReader reader = request.getReader()) {
                            while ((line = reader.readLine()) != null) {
                                buffer.append(line);
                            }
                        }
                        
                        // Extrai o motivo da rejeição
                        JsonObject jsonObject = gson.fromJson(buffer.toString(), JsonObject.class);
                        String motivo = jsonObject.get("motivo").getAsString();
                        
                        // Em um ambiente real, você rejeitaria a solicitação no banco
                        // Por simplicidade, vamos apenas retornar sucesso
                        
                        out.println("{\"message\": \"Solicitação rejeitada com sucesso\"}");
                    } catch (NumberFormatException e) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.println("{\"error\": \"ID da solicitação inválido\"}");
                    }
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("{\"error\": \"Erro ao processar requisição: " + e.getMessage() + "\"}");
            }
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Permite requisições de origens diferentes (CORS)
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}