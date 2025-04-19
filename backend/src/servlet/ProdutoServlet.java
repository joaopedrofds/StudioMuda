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

import conexao.Conexao;
import dao.ProdutoDAO;
import model.Produto;

@WebServlet("/api/produtos")
public class ProdutoServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private ProdutoDAO produtoDAO;
    private Gson gson = new Gson();

    public ProdutoServlet() {
        super();
    }

    @Override
    public void init() throws ServletException {
        super.init();
        try {
            // Inicializa o DAO com uma conexão
            Connection conn = Conexao.getConnection();
            produtoDAO = new ProdutoDAO(conn);
        } catch (SQLException e) {
            throw new ServletException("Erro ao inicializar ProdutoServlet", e);
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
            // Verifica se tem um ID na requisição
            String pathInfo = request.getPathInfo();
            
            if (pathInfo == null || pathInfo.equals("/")) {
                // Lista todos os produtos
                List<Produto> produtos = produtoDAO.listarTodos();
                String produtosJson = gson.toJson(produtos);
                out.println(produtosJson);
            } else {
                // Extrai o ID do path
                String[] urlParts = pathInfo.split("/");
                if (urlParts.length > 1) {
                    String idPart = urlParts[1];
                    try {
                        int id = Integer.parseInt(idPart);
                        Produto produto = produtoDAO.buscarPorId(id);
                        
                        if (produto != null) {
                            String produtoJson = gson.toJson(produto);
                            out.println(produtoJson);
                        } else {
                            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                            out.println("{\"error\": \"Produto não encontrado\"}");
                        }
                    } catch (NumberFormatException e) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.println("{\"error\": \"ID inválido\"}");
                    }
                }
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            PrintWriter out = response.getWriter();
            out.println("{\"error\": \"Erro ao consultar produtos: " + e.getMessage() + "\"}");
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

        try {
            // Lê o corpo da requisição
            StringBuilder buffer = new StringBuilder();
            String line;
            try (java.io.BufferedReader reader = request.getReader()) {
                while ((line = reader.readLine()) != null) {
                    buffer.append(line);
                }
            }
            
            // Converte o JSON para objeto Produto
            Produto novoProduto = gson.fromJson(buffer.toString(), Produto.class);
            
            // Insere no banco
            boolean sucesso = produtoDAO.inserir(novoProduto);
            
            PrintWriter out = response.getWriter();
            if (sucesso) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                out.println("{\"message\": \"Produto cadastrado com sucesso\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("{\"error\": \"Erro ao cadastrar produto\"}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            PrintWriter out = response.getWriter();
            out.println("{\"error\": \"Erro ao processar requisição: " + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Configura o tipo de retorno como JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Permite requisições de origens diferentes (CORS)
        response.setHeader("Access-Control-Allow-Origin", "*");

        String pathInfo = request.getPathInfo();
        PrintWriter out = response.getWriter();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("{\"error\": \"ID do produto não fornecido\"}");
            return;
        }
        
        try {
            // Extrai o ID do path
            String[] urlParts = pathInfo.split("/");
            if (urlParts.length > 1) {
                String idPart = urlParts[1];
                try {
                    int id = Integer.parseInt(idPart);
                    
                    // Lê o corpo da requisição
                    StringBuilder buffer = new StringBuilder();
                    String line;
                    try (java.io.BufferedReader reader = request.getReader()) {
                        while ((line = reader.readLine()) != null) {
                            buffer.append(line);
                        }
                    }
                    
                    // Converte o JSON para objeto Produto
                    Produto produtoAtualizado = gson.fromJson(buffer.toString(), Produto.class);
                    produtoAtualizado.setId(id);
                    
                    // Atualiza no banco
                    boolean sucesso = produtoDAO.atualizar(produtoAtualizado);
                    
                    if (sucesso) {
                        out.println("{\"message\": \"Produto atualizado com sucesso\"}");
                    } else {
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        out.println("{\"error\": \"Erro ao atualizar produto\"}");
                    }
                } catch (NumberFormatException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.println("{\"error\": \"ID inválido\"}");
                }
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"error\": \"Erro ao processar requisição: " + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Configura o tipo de retorno como JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Permite requisições de origens diferentes (CORS)
        response.setHeader("Access-Control-Allow-Origin", "*");

        String pathInfo = request.getPathInfo();
        PrintWriter out = response.getWriter();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("{\"error\": \"ID do produto não fornecido\"}");
            return;
        }
        
        try {
            // Extrai o ID do path
            String[] urlParts = pathInfo.split("/");
            if (urlParts.length > 1) {
                String idPart = urlParts[1];
                try {
                    int id = Integer.parseInt(idPart);
                    
                    // Exclui do banco
                    boolean sucesso = produtoDAO.excluir(id);
                    
                    if (sucesso) {
                        out.println("{\"message\": \"Produto excluído com sucesso\"}");
                    } else {
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        out.println("{\"error\": \"Erro ao excluir produto\"}");
                    }
                } catch (NumberFormatException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.println("{\"error\": \"ID inválido\"}");
                }
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"error\": \"Erro ao processar requisição: " + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Permite requisições de origens diferentes (CORS)
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}