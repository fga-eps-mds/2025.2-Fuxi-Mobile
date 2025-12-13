# Projeto Vitra - Mobile (Grupo Fuxi 2025.2)

Este repositório contém o código-fonte do aplicativo mobile (React Native com Expo) do projeto Vitra.

## 🔗 Links

- **Repositório da Documentação:** [2025.2-Fuxi-Docs](https://github.com/fga-eps-mds/2025.2-Fuxi-Docs)
- **Repositório da API:** [2025.2-Fuxi-API](https://github.com/fga-eps-mds/2025.2-Fuxi-API)

## 🚀 Executar projeto...

### 💻 Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) ou [NPM](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`

### 1. Clonar o repositório

```bash
git clone https://github.com/fga-eps-mds/2025.2-Fuxi-Mobile.git

cd 2025.2-Fuxi-Mobile
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Este projeto utiliza variáveis de ambiente para configuração de URL da API.

🔒 **Importante:** o arquivo `.env` **não é versionado** por motivos de segurança.

#### Passo a passo:

#### Copie o arquivo de exemplo:

```bash
cp .env.example .env
```
#### Preencha as variáveis conforme seu ambiente local.

```bash
EXPO_PUBLIC_API_URL="http://[IP DA API AQUI]:8000"
```


### 4. Inicializar projeto no repositório local

```bash
npx expo start
```

## 🧪 Executar Testes...

### 1. Executar testes unitários

```bash
npm run test
```

### 2. Verificar cobertura dos testes unitários

```bash
npm run test:coverage
```

## 📱 Criar BUILD para Android

### 1. Instalar o EAS CLI

```bash
npm install -g eas-cli
```

### 2. Fazer login em sua conta EXPO

```bash
eas login
```

### 3. Gerar APK

```bash
eas build -p android --profile preview
```

### 📱 Opções para visualizar o aplicativo no desenvolvimento:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) (Android e IOS)
