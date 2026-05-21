# TicTacToang Architecture Diagrams

These Mermaid diagrams reflect the current repository structure in `frontend/src` and `backend/src`. Older image diagrams were used only as architectural reference; this document favors the current file and folder names in the repo.

## 1. High-Level Container Architecture Diagram

```mermaid
flowchart LR
  actor[Player/Admin Browser<br><<client>>]

  subgraph FE[React + Vite Frontend SPA <<container>>]
    spa[main.jsx / RouterProvider<br><<SPA>>]
    routes[ProtectedRoute.jsx + RoleRoute.jsx<br><<role routing>>]
    http[config/api.config.js + lib/httpClient.js<br><<REST helper/API config>>]
    wsClient[lib/socket.js + lib/spectatorSocket.js<br><<WebSocket client>>]
  end

  subgraph BE[Node.js + Express Backend API <<container>>]
    server[server.js<br><<HTTP server + socket bootstrap>>]
    app[src/app.js<br><<Express app>>]
    apiRoutes[src/routes/index.js<br><<route registry>>]
    middleware[authenticate.js + authorizeRole.js<br><<middleware>>]
    modules[modules/auth, profile, admin, game,<br>premium, multiplayer<br><<modular monolith>>]
    socketServer[multiplayer/socket/socketServer.js<br><<real-time handling>>]
  end

  db[(MongoDB<br><<database>>)]
  stripe[Stripe Checkout/Webhook<br><<external payment>>]
  email[Email Service<br><<external email>>]
  storage[Cloudinary<br><<external storage>>]

  actor -->|HTTPS SPA assets| spa
  spa -->|Client-side route access checks| routes
  routes -->|HTTPS REST / JSON| http
  http -->|Authorization: Bearer JWT| app
  http -->|HTTP-only refresh cookie| app
  wsClient -->|WebSocket events + auth token| socketServer
  server -->|mounts Express app| app
  server -->|initializes| socketServer
  app -->|/api routes| apiRoutes
  apiRoutes -->|Route dispatch| middleware
  middleware -->|validated request| modules
  modules -->|DTO JSON response| app
  modules -->|Mongoose CRUD| db
  socketServer -->|WebSocket events| modules
  modules -->|Checkout session + webhook verification| stripe
  modules -->|Payment success email| email
  modules -->|Profile logo upload/delete| storage
```

## 2. High-Level Frontend Component Diagram

```mermaid
flowchart TB
  main[main.jsx<br><<bootstrap>>]
  authProvider[modules/auth/context/AuthContext.jsx<br>AuthProvider / AuthContext <<context>>]
  router[app/router.jsx<br><<router>>]
  protected[routes/ProtectedRoute.jsx<br><<route guard>>]
  role[routes/RoleRoute.jsx<br><<role route>>]
  appLayout[App.jsx + components/AppLayout.jsx<br><<layout>>]
  publicLayout[components/PublicLayout.jsx + AuthLayout.jsx<br><<layout>>]
  nav[components/NavBar/NavBar.jsx<br><<shared layout>>]

  subgraph Modules[Feature Modules <<module>>]
    auth[modules/auth<br><<module>>]
    profile[modules/profile<br><<module>>]
    game[modules/game<br><<module>>]
    admin[modules/admin<br><<module>>]
    premium[modules/premium<br><<module>>]
  end

  subgraph Shared[Shared Frontend Support]
    sharedComponents[components/ + components/ui/<br><<component>>]
    apiConfig[config/api.config.js<br><<API config + apiRequest>>]
    httpClient[lib/httpClient.js<br><<REST helper + token refresh>>]
    sockets[lib/socket.js + lib/spectatorSocket.js<br><<WebSocket helper>>]
    styles[styles/globals.css<br><<styles>>]
    filters[profile hooks/filter state<br><<filters>>]
    hooks[modules/*/hooks<br><<hook>>]
  end

  backend[Backend API<br><<container>>]

  main --> authProvider
  authProvider --> router
  router --> publicLayout
  router --> protected
  protected --> appLayout
  protected --> role
  role --> auth
  role --> profile
  role --> game
  role --> admin
  role --> premium
  appLayout --> nav
  appLayout --> sharedComponents

  auth -->|Page -> Component -> Hook -> Service| apiConfig
  profile -->|Page -> Component -> Hook -> Service/API| httpClient
  game -->|Page -> Component -> Hook -> Service/API| apiConfig
  game -->|online play/spectator events| sockets
  admin -->|Page -> Component -> Hook -> Service| httpClient
  premium -->|Page -> Service| apiConfig

  apiConfig -->|REST helper builds /api URLs| backend
  httpClient -->|REST helper with Bearer JWT + refresh retry| backend
  sockets -->|WebSocket events| backend
```

## 3. High-Level Backend Component Diagram

```mermaid
flowchart LR
  server[server.js<br><<entrypoint>>]
  app[src/app.js<br><<Express app>>]
  routes[src/routes/index.js<br><<route registry>>]

  subgraph Middleware[Middleware Layer]
    authMw[middleware/authenticate.js<br><<middleware>>]
    roleMw[middleware/authorizeRole.js<br><<middleware>>]
    uploadMw[middleware/uploadMiddleware.js<br><<middleware>>]
    limiter[middleware/loginAttemptLimiter.js<br><<middleware>>]
  end

  subgraph Shared[Shared Utilities / Errors / Config]
    appError[shared/errors/AppError.js<br><<error>>]
    response[shared/utils/httpResponse.js<br><<DTO/error response>>]
    tokenUtils[shared/utils/token.utils.js<br><<utility>>]
    uploadUtils[shared/utils/upload.utils.js<br><<utility>>]
    emailUtils[shared/utils/email.js<br><<utility>>]
    config[config/db.js + config/cloudinary.js<br><<config>>]
  end

  subgraph Modules[modules/ <<modular monolith>>]
    auth[auth<br>route -> controller -> service -> repository -> model<br><<module>>]
    profile[profile<br>route -> controller -> service -> repository -> model<br><<module>>]
    admin[admin<br>route -> controller -> service<br><<module>>]
    game[game<br>api/routes -> controllers -> application/services -> infrastructure/repositories -> model<br><<module>>]
    premium[premium<br>route -> controller -> service -> repository -> model<br><<module>>]
    multiplayer[multiplayer<br>api/routes -> api/controller -> application/services -> infrastructure/repositories -> model/socket<br><<module>>]
    wallet[wallet<br>not present in current repo<br><<module absent>>]
  end

  subgraph Interfaces[Cross-Module Interfaces]
    authIface[auth.interface.js<br><<interface>>]
    gameIface[game/domain/interfaces/game.interface.js<br><<interface>>]
    premiumIface[premium.interface.js<br><<interface>>]
    multiplayerIface[multiplayer/domain/interfaces/multiplayer.interface.js<br><<interface>>]
  end

  dto[DTO / response shaping<br>publicUserDto, profileResponseDto,<br>toGameStateDto, status DTOs<br><<DTO>>]
  mongo[(MongoDB<br><<database>>)]

  server -->|creates HTTP server| app
  server -->|initializes socket server| multiplayer
  app -->|mounts /api routers| routes
  routes -->|Route| Middleware
  Middleware -->|Controller| Modules
  Shared -.-> Modules

  auth -->|Model| mongo
  profile -->|Model| mongo
  game -->|Model| mongo
  premium -->|Model| mongo
  multiplayer -->|Model| mongo
  Modules -->|maps DB documents| dto
  dto -->|DTO JSON response| app

  admin -->|Admin Service -> Auth Interface| authIface
  admin -->|Admin Service -> Game Interface| gameIface
  admin -->|Admin Service -> Premium Interface| premiumIface
  admin -->|Admin Service -> Multiplayer Interface| multiplayerIface
  profile -->|Profile Service -> Auth/Game/Premium interfaces| Interfaces
  multiplayer -->|Multiplayer Service -> Game Interface| gameIface
  auth -->|Auth Repository -> Premium Interface| premiumIface
```

## 4. Low-Level Frontend Module Diagrams

### Auth Module

```mermaid
flowchart TB
  subgraph AuthModule[frontend/src/modules/auth <<module>>]
    pages[pages/<br>LoginPage.jsx<br>RegisterPage.jsx<br>DashBoardPage.jsx<br>Profile.jsx <<page>>]
    components[components/<br>LoginForm/LoginForm.jsx<br>LoginForm/RegisterForm/RegisterForm.jsx<br>FormErrorAlert/FormErrorAlert.jsx <<component>>]
    hooks[hooks/<br>useAuth.js<br>useLoginForm.js<br>useRegisterForm.js <<hook>>]
    context[context/AuthContext.jsx<br>context/auth-context.js <<context>>]
    services[services/auth.service.js <<service>>]
    utils[utils/auth.validation.js <<utility>>]
  end

  apiConfig[frontend/src/config/api.config.js<br>API_ENDPOINTS.auth + apiRequest <<REST helper/API config>>]
  httpClient[frontend/src/lib/httpClient.js<br>initHttpClient/token refresh helper <<REST helper>>]
  backend[Backend /api/auth<br><<API>>]

  pages --> components
  components --> hooks
  pages --> hooks
  hooks --> context
  hooks --> services
  context --> services
  context --> httpClient
  services --> utils
  services --> apiConfig
  apiConfig --> backend
  httpClient --> backend
```

### Profile Module

```mermaid
flowchart TB
  subgraph ProfileModule[frontend/src/modules/profile <<module>>]
    pages[pages/<br>ProfilePage.jsx<br>EditProfilePage.jsx<br>GameHistoryPage.jsx<br>MatchReplayPage.jsx <<page>>]
    components[components/<br>ProfileCard/<br>EditProfileForm/<br>GameHistoryTable/<br>MatchReplay/<br>ProfileTabs/ <<component>>]
    subcomponents[MatchReplay/sub-components/<br>MatchReplayBoard.jsx<br>MatchReplayControls.jsx<br>MatchReplayModal.jsx <<component>>]
    hooks[hooks/<br>useProfileCard.js<br>useEditProfileForm.js<br>useProfileStats.js<br>useGameHistoryTable.js<br>useMatchReplay.js <<hook>>]
    services[services/<br>profile.service.js<br>history.service.js <<service>>]
    api[api/profile.api.js <<API adapter>>]
    utils[utils/<br>datetime.utils.js<br>profileStats.utils.js<br>replay.utils.js<br>styles/profile.css <<utility/styles>>]
  end

  httpClient[frontend/src/lib/httpClient.js<br><<REST helper>>]
  backend[Backend /api/profile<br><<API>>]

  pages --> components
  components --> subcomponents
  components --> hooks
  hooks --> services
  services --> api
  components --> utils
  hooks --> utils
  api -->|literal /api/profile paths| httpClient
  httpClient --> backend
```

### Game Module

```mermaid
flowchart TB
  subgraph GameModule[frontend/src/modules/game <<module>>]
    pages[pages/<br>LocalGameSetupPage.jsx<br>AIGameSetupPage.jsx<br>OnlineArenaPage.jsx<br>GamePlayPage.jsx<br>SpectatorMatchPage.jsx <<page>>]
    setupComponents[components/<br>LocalGameSetupForm/<br>AIGameSetupForm/<br>OnlineGameSetupForm/ <<component>>]
    playView[components/GamePlayView/<br>GamePlayView.jsx<br>GamePlayView.hook.js<br>GamePlayView.service.js <<component/hook/service>>]
    spectator[components/SpectatorMatchView/<br>SpectatorMatchView.jsx<br>SpectatorMatchView.hook.js <<component/hook>>]
    subcomponents[GamePlayView/sub-components/<br>GameBoard.jsx, GameCell.jsx, GameHeaderBar.jsx,<br>PlayerStatusCard.jsx, dialogs/modals <<component>>]
    sharedSetup[components/shared/<br>SetupBoardSizeSelector, SetupBoardStyleSelector,<br>SetupFirstPlayerSelector, SetupMarkerSelector,<br>SetupPlayerPreviewCard <<component>>]
    api[api/game.api.js <<API adapter>>]
    utils[utils/game.helpers.js<br>utils/game.constants.js <<utility>>]
  end

  gameChat[frontend/src/components/GameChat/<br><<shared component>>]
  apiConfig[frontend/src/config/api.config.js<br>API_ENDPOINTS.game + API_ENDPOINTS.multiplayer <<API config>>]
  sockets[frontend/src/lib/socket.js + lib/spectatorSocket.js<br><<WebSocket helper>>]
  backend[Backend /api/game + /api/multiplayer<br><<API>>]

  pages --> setupComponents
  pages --> playView
  pages --> spectator
  setupComponents --> sharedSetup
  playView --> subcomponents
  playView --> api
  spectator --> api
  spectator --> sockets
  playView --> sockets
  playView --> utils
  setupComponents --> utils
  playView --> gameChat
  api --> apiConfig
  apiConfig --> backend
  sockets --> backend
```

### Admin Module

```mermaid
flowchart TB
  subgraph AdminModule[frontend/src/modules/admin <<module>>]
    pages[pages/<br>AdminDashboardPage.jsx<br>PlayerManagementPage.jsx<br>OnlineRoomsPage.jsx <<page>>]
    playerTable[components/PlayerTable/<br>PlayerTable.jsx<br>sub-components/PlayerSearchBar.jsx<br>StatusConfirmModal.jsx<br>StatusFeedbackModal.jsx <<component>>]
    roomTable[components/RoomTable/<br>RoomTable.jsx<br>sub-components/RoomSearchBar.jsx <<component>>]
    hooks[hooks/<br>usePlayerTable.js<br>useRoomTable.js <<hook>>]
    service[services/admin.service.js <<service>>]
  end

  httpClient[frontend/src/lib/httpClient.js<br><<REST helper>>]
  backend[Backend /api/admin<br><<API>>]

  pages --> playerTable
  pages --> roomTable
  playerTable --> hooks
  roomTable --> hooks
  hooks --> service
  service -->|literal /api/admin paths| httpClient
  httpClient --> backend
```

### Premium Module

```mermaid
flowchart TB
  subgraph PremiumModule[frontend/src/modules/premium <<module>>]
    pages[pages/<br>PremiumPage.jsx<br>PremiumSuccessPage.jsx<br>PremiumCancelPage.jsx <<page>>]
    service[services/premium.service.js <<service>>]
  end

  profileService[modules/profile/services/profile.service.js<br><<service>>]
  apiConfig[frontend/src/config/api.config.js<br>API_ENDPOINTS.premium + apiRequest <<REST helper/API config>>]
  backend[Backend /api/premium<br><<API>>]
  stripe[Stripe Checkout Redirect<br><<external payment>>]

  pages --> service
  pages -->|load email/status context| profileService
  service --> apiConfig
  apiConfig --> backend
  service -->|checkout session URL| stripe
```

## 5. Low-Level Backend Module Diagrams

### Auth Module

```mermaid
flowchart TB
  route[auth.route.js<br><<route>>]
  controller[auth.controller.js<br><<controller>>]
  service[auth.service.js<br><<service>>]
  validation[auth.validation.js<br><<validation>>]
  repository[auth.repository.js<br><<repository>>]
  interface[auth.interface.js<br><<interface>>]
  models[model/user.model.js<br>model/refreshBlacklist.model.js<br><<model>>]
  profileModel[../profile/profile.model.js<br><<model direct import>>]
  premiumIface[../premium/premium.interface.js<br><<interface>>]
  middleware[../../middleware/authenticate.js<br>loginAttemptLimiter.js <<middleware>>]
  dto[publicUserDto / mapAuthUser<br><<DTO>>]
  mongo[(MongoDB)]

  route --> controller
  route --> middleware
  route -.->|profile aliases| profileModel
  controller --> validation
  controller --> service
  controller --> dto
  service --> validation
  service --> repository
  service --> dto
  interface --> repository
  repository --> models
  repository --> profileModel
  repository --> premiumIface
  models --> mongo
  profileModel --> mongo
```

### Profile Module

```mermaid
flowchart TB
  route[profile.route.js<br><<route>>]
  controller[profile.controller.js<br><<controller>>]
  service[profile.service.js<br><<service>>]
  validation[profile.validation.js<br><<validation>>]
  repository[profile.repository.js<br><<repository>>]
  model[profile.model.js<br><<model>>]
  authIface[../auth/auth.interface.js<br><<interface>>]
  gameIface[../game/domain/interfaces/game.interface.js<br><<interface>>]
  premiumIface[../premium/premium.interface.js<br><<interface>>]
  upload[uploadMiddleware.js + upload.utils.js<br><<middleware/utility>>]
  dto[profileResponseDto + history/replay DTOs<br><<DTO>>]
  mongo[(MongoDB)]
  storage[Cloudinary<br><<external storage>>]

  route --> controller
  route --> upload
  controller --> service
  service --> validation
  service --> repository
  service --> authIface
  service --> gameIface
  service --> premiumIface
  service --> upload
  service --> dto
  repository --> model
  model --> mongo
  upload --> storage
```

### Admin Module

```mermaid
flowchart TB
  route[admin.route.js<br><<route>>]
  authMw[authenticate.js<br><<middleware>>]
  roleMw[authorizeRole.js<br><<middleware>>]
  controller[admin.controller.js<br><<controller>>]
  service[admin.service.js<br><<service>>]
  authIface[auth.interface.js<br><<interface>>]
  gameIface[game.interface.js<br><<interface>>]
  premiumIface[premium.interface.js<br><<interface>>]
  multiplayerIface[multiplayer.interface.js<br><<interface>>]
  socketServer[multiplayer/socket/socketServer.js<br><<socket utility>>]
  roomSocket[roomSocketHandler.js<br><<socket handler>>]
  dto[admin response DTOs assembled in service<br><<DTO>>]
  mongo[(MongoDB via module interfaces)]

  route --> authMw
  authMw --> roleMw
  roleMw --> controller
  controller --> service
  service --> authIface
  service --> gameIface
  service --> premiumIface
  service --> multiplayerIface
  service --> socketServer
  service --> roomSocket
  service --> dto
  authIface --> mongo
  gameIface --> mongo
  premiumIface --> mongo
  multiplayerIface --> mongo
```

### Game Module

```mermaid
flowchart TB
  route[api/routes/game.route.js<br><<route layer>>]
  controller[controllers/game.controller.js<br><<controller layer>>]
  service[application/services/game.service.js<br><<service layer>>]
  validation[application/validators/game.validation.js<br><<validation>>]
  repository[infrastructure/repositories/game.repository.js<br><<repository layer>>]
  interface[domain/interfaces/game.interface.js<br><<interface layer>>]
  models[model/<br>gameSession.model.js<br>gameParticipant.model.js<br>move.model.js<br><<persistence model layer>>]
  lobbyModel[../multiplayer/model/matchLobby.model.js<br><<model direct import>>]
  ai[ai/easy-ai.js<br>ai/medium-ai.js<br>ai/hard-ai.js <<utility>>]
  utils[utils/board.utils.js<br>utils/winChecker.js <<utility>>]
  dto[toGameStateDto + replay/history DTOs<br><<DTO>>]
  mongo[(MongoDB)]

  route --> controller
  controller --> validation
  controller --> service
  service --> repository
  service --> ai
  service --> utils
  service --> dto
  interface --> service
  interface --> repository
  interface --> dto
  repository --> models
  repository --> lobbyModel
  models --> mongo
  lobbyModel --> mongo
```

### Premium Module

```mermaid
flowchart TB
  route[premium.route.js<br><<route>>]
  webhook[src/app.js /api/premium/stripe-webhook<br><<raw body route>>]
  controller[premium.controller.js<br><<controller>>]
  validation[premium.validation.js<br><<validation>>]
  service[premium.service.js<br><<service>>]
  repository[premium.repository.js<br><<repository>>]
  interface[premium.interface.js<br><<interface>>]
  models[model/<br>subscriptionPlan.model.js<br>userSubscription.model.js<br>transaction.model.js <<model>>]
  directModels[../auth/model/user.model.js<br>../profile/profile.model.js<br><<model direct import>>]
  email[email.js<br><<external email utility>>]
  stripe[Stripe<br><<external payment>>]
  dto[toSubscriptionStatusDto<br><<DTO>>]
  mongo[(MongoDB)]

  route --> controller
  webhook --> controller
  controller --> validation
  controller --> service
  service --> repository
  service --> stripe
  service --> email
  service --> dto
  interface --> models
  repository --> models
  repository --> directModels
  models --> mongo
  directModels --> mongo
```

### Wallet Module

```mermaid
flowchart TB
  absent[backend/src/modules/wallet<br>not present in current repo<br><<module absent>>]
  oldRef[Old backend diagram referenced wallet.route.js,<br>wallet.controller.js, wallet.service.js,<br>wallet.repository.js, wallet.model.js<br><<old diagram element>>]
  note[No current route/controller/service/repository/model files found.<br>Do not include as implemented architecture in report body.<br><<accuracy note>>]

  oldRef -.-> absent
  absent --> note
```

### Multiplayer Module

```mermaid
flowchart TB
  route[api/routes/multiplayer.route.js<br><<route>>]
  controller[api/controller/multiplayer.controller.js<br><<controller>>]
  service[application/services/multiplayer.service.js<br><<service>>]
  validation[application/validators/multiplayer.validation.js<br><<validation file>>]
  repository[infrastructure/repositories/multiplayer.repository.js<br><<repository>>]
  legacyRepo[multiplayer.repository.js<br><<legacy/duplicate repository helper>>]
  legacyIface[multiplayer.interface.js<br><<legacy interface file>>]
  interface[domain/interfaces/multiplayer.interface.js<br><<interface>>]
  model[model/matchLobby.model.js<br><<model>>]
  sockets[socket/<br>socketServer.js<br>roomSocketHandler.js<br>moveSocketHandler.js<br>chatSocketHandler.js<br>spectatorSocketHandler.js <<socket handlers>>]
  gameIface[../game/domain/interfaces/game.interface.js<br><<interface>>]
  authModels[../auth/model/user.model.js + ../profile/profile.model.js<br><<direct model imports in socket auth>>]
  dto[lobby/spectator DTOs<br><<DTO>>]
  mongo[(MongoDB)]

  route --> controller
  controller --> service
  service --> repository
  service --> gameIface
  service --> dto
  interface --> repository
  repository --> model
  sockets --> service
  sockets --> gameIface
  sockets --> authModels
  validation -.-> route
  legacyRepo -.-> model
  legacyIface -.-> note[not used by route registry<br><<accuracy note>>]
  model --> mongo
  authModels --> mongo
```

## Architecture Notes

- The backend is structured as a modular monolith: feature modules live under `backend/src/modules`, share one Express process, and persist through MongoDB/Mongoose.
- The intended backend flow is represented as `Route -> Controller -> Service -> Repository -> Model -> MongoDB`. The `game` and `multiplayer` modules use a more layered folder naming style: `api/routes`, `api/controller` or `controllers`, `application/services`, `infrastructure/repositories`, `domain/interfaces`, and `model`.
- Cross-module communication is mainly intended to go through module interfaces such as `auth.interface.js`, `game.interface.js`, `premium.interface.js`, and `multiplayer/domain/interfaces/multiplayer.interface.js`.
- DTO/response shaping is done inside services and middleware before returning data, for example `publicUserDto`, `profileResponseDto`, `toGameStateDto`, `toSubscriptionStatusDto`, replay/history DTO mapping, and safe `req.user` shaping in `authenticate.js`.
- Authentication and authorization are separated: `authenticate.js` validates Bearer JWTs and token blacklist state, while `authorizeRole.js` enforces allowed roles such as admin routes.
- The frontend follows a feature-module shape where pages render components, components use hooks, hooks call services/API adapters, and those services call backend REST endpoints through either `config/api.config.js` or `lib/httpClient.js`.
- `config/api.config.js` owns API base URL, endpoint constants, token helpers, and an `apiRequest` wrapper. `lib/httpClient.js` is a second REST helper focused on automatic token refresh and HTTP verb helpers.
- Frontend role-based routing is implemented in `ProtectedRoute.jsx` and `RoleRoute.jsx`, with `app/router.jsx` splitting player and admin route trees.

## Diagram Accuracy Check

- No `docs/` folder or repo-local `docs/assets` old diagrams were found before this file was created. The old frontend/backend images supplied in the prompt reference several names that do not fully match this repository.
- The old backend diagram includes wallet and media/user modules. The current backend repo does not contain `backend/src/modules/wallet`, `backend/src/modules/media`, or `backend/src/modules/user`; wallet is shown only as absent because the requested module has no current files.
- The old frontend diagram references files such as `config/constants.js`, `hooks/useResponsive.js`, `filters/gameHistory.filter.js`, `player.filter.js`, and `room.filter.js`; those files were not found in the current frontend tree.
- Some frontend services use `API_ENDPOINTS` from `config/api.config.js` (`auth`, `game`, `premium`), while others hardcode literal `/api/...` paths through `lib/httpClient.js` (`admin`, `profile`). This is an architecture inconsistency against a single API config source.
- There are two REST helper layers: `config/api.config.js` exports `apiRequest`, while `lib/httpClient.js` exports verb helpers and refresh retry behavior. Both are active, which can duplicate responsibility.
- Backend interface-based cross-module communication is present, especially in `admin.service.js`, `profile.service.js`, and `multiplayer.service.js`. Some direct cross-module imports still bypass interfaces: `auth.repository.js` imports `profile.model.js`, `premium.repository.js` imports auth/profile models, `game.repository.js` imports `multiplayer/model/matchLobby.model.js`, and `multiplayer/socket/socketServer.js` imports auth/profile models and auth repository directly.
- `admin` currently has route/controller/service files but no module-local repository, model, validation, or interface files. It operates as an orchestration module over other module interfaces.
- `profile` has route/controller/service/repository/model/validation files, but no module-local `profile.interface.js`.
- `multiplayer` contains the intended layered files and socket handlers, plus top-level `multiplayer.repository.js` and `multiplayer.interface.js` files that appear separate from the route-registered layered path.
- `config/db.js` exists, but `server.js` currently connects to MongoDB directly with `mongoose.connect(...)` instead of using that helper.
- No empty backend or frontend source files were found during inspection.
