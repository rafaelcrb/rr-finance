💰 RR-Finance – Gerenciador Financeiro Pessoal

O RR-Finance é um aplicativo mobile desenvolvido com React Native (Expo) para facilitar o controle das finanças pessoais. Com foco em usabilidade, responsividade e funcionalidades inteligentes, o app permite que usuários registrem, acompanhem e analisem suas receitas, despesas e saldo mensal, além de visualizar gráficos e dicas financeiras.

📱 Funcionalidades Principais
- ✅ Autenticação de usuários com Firebase Authentication (login, cadastro e recuperação de senha)
- 📊 Painel financeiro com resumo de receitas, despesas e saldo
- ➕ Cadastro e edição de receitas e despesas com data e valor
- 📈 Visualização de gráficos em pizza e barras com base nos últimos 3 meses
- 💡 Dicas diárias de finanças pessoais
- ⚙️ Tela de configurações com inserção de salário, alteração de senha e edição de perfil
- 🔒 Persistência de dados com Firebase Firestore
- 🎨 Interface intuitiva, responsiva e moderna

🚀 Tecnologias Utilizadas
- React Native com Expo
- TypeScript
- Firebase (Authentication & Firestore)
- Formik & Yup (validação de formulários)
- React Native Chart Kit (gráficos)
- AsyncStorage (persistência)
- React Navigation e Expo Router
- React Native Modal & Picker
- KeyboardAwareScrollView

🧪 Instalação e Execução
Clone este repositório e instale as dependências:

git clone https://github.com/rafaelcrb/rr-finance.git
cd rr-finance
npm install

Configure o arquivo .env com suas chaves do Firebase:

EXPO_PUBLIC_apiKey=SUACHAVE
EXPO_PUBLIC_authDomain=SUACHAVE
EXPO_PUBLIC_projectId=SUACHAVE
EXPO_PUBLIC_storageBucket=SUACHAVE
EXPO_PUBLIC_messagingSenderId=SUACHAVE
EXPO_PUBLIC_appId=SUACHAVE
EXPO_PUBLIC_measurementId=SUACHAVE

Execute o projeto com o Expo:

npm start

🧠 Estrutura de Pastas

O projeto está organizado da seguinte forma:

src/
  ├── app/
  │   ├── (login)/ → Telas de login e cadastro
  │   ├── inicio/ → Dashboard principal
  │   ├── despesas/ → Tela de cadastro de despesas
  │   ├── receitas/ → Tela de cadastro de receitas
  │   ├── graficos/ → Tela de análise gráfica
  │   ├── menu/ → Tela de configurações
  │   └── dicas/ → Dicas financeiras
  └── config/ → Configurações do Firebase

📸 Capturas de Tela
(Adicione aqui imagens das telas principais, como login, dashboard, gráficos etc.)

📋 Contribuição
Fique à vontade para enviar sugestões, melhorias ou abrir uma issue! 👥

👨‍💻 Desenvolvedor
Rafael Rodrigues
💼 Estudante de Engenharia de Software – CESMAC
📍 Alagoas – Brasil
📧 contato: rafaelcrb@hotmail.com.br
🔗 GitHub: https://github.com/rafaelcrb
"""


