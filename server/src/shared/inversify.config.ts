import type { Model } from "mongoose";
import type { SocketActiveUsers } from "socket.io";
import { Container } from "inversify";
import { TYPES } from "./types";
import { BcryptPasswordHasher } from "@/infrastructure/services/BcryptPasswordHasher";
import { CloudinaryStorageService } from "@/infrastructure/services/CloudinaryStorageService";
import { JwtTokenService } from "@/infrastructure/services/JwtTokenService";
import { MailService } from "@/infrastructure/services/MailService";
import { OtpService } from "@/infrastructure/services/OtpService";
import { FirebaseAuthService } from "@/infrastructure/services/FirebaseAuthService";
import { SocketNotificationService } from "@/infrastructure/services/SocketNotificationService";

import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { CommentRepository } from "@/infrastructure/repositories/CommentRepository";
import { ConversationRepository } from "@/infrastructure/repositories/ConversationRepository";
import { FollowRepository } from "@/infrastructure/repositories/FollowRepository";
import { MessageRepository } from "@/infrastructure/repositories/MessageRepository";
import { OtpRepository } from "@/infrastructure/repositories/OtpRepository";
import { PostRepository } from "@/infrastructure/repositories/PostRepository";
import { ReportRepository } from "@/infrastructure/repositories/ReportRepository";
import { UserActivityRepository } from "@/infrastructure/repositories/UserActivityRepository";

import type { IPasswordHasher } from "@/domain/services/IPasswordHasher";
import type { IFileStorageService } from "@/domain/services/IFileStorageService";
import type { IExternalAuthService } from "@/domain/services/IExternalAuthService";
import type { ITokenService } from "@/domain/services/ITokenService";
import type { IMailService } from "@/domain/services/IMailService";
import type { IOtpService } from "@/domain/services/IOtpService";
import type { INotificationService } from "@/domain/services/INotificationService";

import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type { ICommentRepository } from "@/domain/repositories/ICommentRepository";
import type { IConversationRepository } from "@/domain/repositories/IConversationRepository";
import type { IFollowRepository } from "@/domain/repositories/IFollowRepository";
import type { IMessageRepository } from "@/domain/repositories/IMessageRepository";
import type { IOtpRepository } from "@/domain/repositories/IOtpRepository";
import type { IPostRepository } from "@/domain/repositories/IPostRepository";
import type { IReportRepository } from "@/domain/repositories/IReportRepository";
import type { IUserActivityRepository } from "@/domain/repositories/IUserActivityRepository";

import { CreateUser } from "@/application/use-cases/CreateUser";
import { AddComment } from "@/application/use-cases/AddComment";
import { AdminLogin } from "@/application/use-cases/AdminLogin";
import { CreateConversation } from "@/application/use-cases/CreateConversation";
import { CreatePost } from "@/application/use-cases/CreatePost";
import { DeletePost } from "@/application/use-cases/DeletePost";
import { EditPost } from "@/application/use-cases/EditPost";
import { GetAdminPosts } from "@/application/use-cases/GetAdminPosts";
import { GetAdminUsers } from "@/application/use-cases/GetAdminUsers";
import { GetComments } from "@/application/use-cases/GetComments";
import { GetConversation } from "@/application/use-cases/GetConversation";
import { GetConversations } from "@/application/use-cases/GetConversations";
import { GetFollowList } from "@/application/use-cases/GetFollowList";
import { GetLikedUsers } from "@/application/use-cases/GetLikedUsers";
import { GetMessages } from "@/application/use-cases/GetMessages";
import { GetPostById } from "@/application/use-cases/GetPostById";
import { GetSavedPosts } from "@/application/use-cases/GetSavedPosts";
import { FetchUser } from "@/application/use-cases/FetchUser";
import { GetUserProfile } from "@/application/use-cases/GetUserProfile";
import { LoginUser } from "@/application/use-cases/LoginUser";
import { MarkMessageAsSeen } from "@/application/use-cases/MarkMessageAsSeen";
import { RefreshToken } from "@/application/use-cases/RefreshToken";
import { ReportTarget } from "@/application/use-cases/ReportTarget";
import { SearchContent } from "@/application/use-cases/SearchContent";
import { SendMessage } from "@/application/use-cases/SendMessage";
import { SendVerificationEmail } from "@/application/use-cases/SendVerificationEmail";
import { SignInWithGoogle } from "@/application/use-cases/SignInWithGoogle";
import { SuggestUser } from "@/application/use-cases/SuggestUser";
import { ToggleFollow } from "@/application/use-cases/ToggleFollow";
import { ToggleLike } from "@/application/use-cases/ToggleLike";
import { TogglePostStatus } from "@/application/use-cases/TogglePostStatus";
import { ToggleSavePost } from "@/application/use-cases/ToggleSavePost";
import { ToggleUserStatus } from "@/application/use-cases/ToggleUserStatus";
import { UpdateProfile } from "@/application/use-cases/UpdateProfile";
import { VerifyOtp } from "@/application/use-cases/VerifyOtp";
import { RequestPasswordReset } from "@/application/use-cases/RequestPasswordReset";
import { ResetPassword } from "@/application/use-cases/ResetPassword";
import { RecordUserActivity } from "@/application/use-cases/RecordUserActivity";
import { GetPosts } from "@/application/use-cases/GetPosts";
import { GetDashboardData } from "@/application/use-cases/GetDashboardData";

import { AuthController } from "@/interface-adapters/controllers/auth.controller";
import { CommentController } from "@/interface-adapters/controllers/comment.controller";
import { ConversationController } from "@/interface-adapters/controllers/conversation.controller";
import { FollowController } from "@/interface-adapters/controllers/follow.controller";
import { LikeController } from "@/interface-adapters/controllers/like.controller";
import { PostController } from "@/interface-adapters/controllers/post.controller";
import { ProfileController } from "@/interface-adapters/controllers/profile.controller";
import { ReportController } from "@/interface-adapters/controllers/report.controller";
import { SearchController } from "@/interface-adapters/controllers/search.controller";
import { AdminController } from "@/interface-adapters/controllers/admin.controller";
import { SocketController } from "@/interface-adapters/controllers/socket.controller";
import { CallController } from "@/interface-adapters/controllers/call.controller";

import { CommentModel } from "@/infrastructure/database/models/CommentModel";
import { CommentMapper } from "@/infrastructure/mappers/CommentMapper";
import { ConversationModel } from "@/infrastructure/database/models/ConversationModel";
import { ConversationMapper } from "@/infrastructure/mappers/ConversationMapper";
import { FollowModel } from "@/infrastructure/database/models/FollowModel";
import { FollowMapper } from "@/infrastructure/mappers/FollowMapper";
import { UserActivityModel } from "@/infrastructure/database/models/UserActivityModel";
import { UserActivityMapper } from "@/infrastructure/mappers/UserActivityMapper";
import { MessageModel } from "@/infrastructure/database/models/MessageModel";
import { MessageMapper } from "@/infrastructure/mappers/MessageMapper";
import { OtpModel } from "@/infrastructure/database/models/OtpModel";
import { OtpMapper } from "@/infrastructure/mappers/OtpMapper";
import { PostModel } from "@/infrastructure/database/models/PostModel";
import { PostMapper } from "@/infrastructure/mappers/PostMapper";
import { ReportModel } from "@/infrastructure/database/models/ReportModel";
import { ReportMapper } from "@/infrastructure/mappers/ReportMapper";
import { UserModel } from "@/infrastructure/database/models/UserModel";
import { UserMapper } from "@/infrastructure/mappers/UserMapper";

// Create a new container
const container = new Container();

// --- BIND SERVICES ---
container.bind<IPasswordHasher>(TYPES.IPasswordHasher).to(BcryptPasswordHasher);
container.bind<ITokenService>(TYPES.ITokenService).to(JwtTokenService);
container.bind<IMailService>(TYPES.IMailService).to(MailService);
container.bind<IOtpService>(TYPES.IOtpService).to(OtpService);
container
  .bind<IExternalAuthService>(TYPES.IExternalAuthService)
  .to(FirebaseAuthService);
container
  .bind<IFileStorageService>(TYPES.IFileStorageService)
  .to(CloudinaryStorageService);
container
  .bind<INotificationService>(TYPES.INotificationService)
  .to(SocketNotificationService)
  .inSingletonScope();

// --- BIND MODELS AND MAPPERS ---
container
  .bind<typeof CommentModel>(TYPES.CommentModel)
  .toConstantValue(CommentModel);
container.bind(TYPES.CommentMapper).to(CommentMapper);
container
  .bind<typeof ConversationModel>(TYPES.ConversationModel)
  .toConstantValue(ConversationModel);
container.bind(TYPES.ConversationMapper).to(ConversationMapper);
container
  .bind<typeof FollowModel>(TYPES.FollowModel)
  .toConstantValue(FollowModel);
container.bind(TYPES.FollowMapper).to(FollowMapper);
container
  .bind<typeof UserActivityModel>(TYPES.UserActivityModel)
  .toConstantValue(UserActivityModel);
container.bind(TYPES.UserActivityMapper).to(UserActivityMapper);
container
  .bind<typeof MessageModel>(TYPES.MessageModel)
  .toConstantValue(MessageModel);
container.bind(TYPES.MessageMapper).to(MessageMapper);
container.bind<typeof OtpModel>(TYPES.OtpModel).toConstantValue(OtpModel);
container.bind(TYPES.OtpMapper).to(OtpMapper);
container.bind<typeof PostModel>(TYPES.PostModel).toConstantValue(PostModel);
container.bind(TYPES.PostMapper).to(PostMapper);
container
  .bind<typeof ReportModel>(TYPES.ReportModel)
  .toConstantValue(ReportModel);
container.bind(TYPES.ReportMapper).to(ReportMapper);
container.bind<typeof UserModel>(TYPES.UserModel).toConstantValue(UserModel);
container.bind(TYPES.UserMapper).to(UserMapper);

// --- BIND REPOSITORIES ---
container.bind<IFollowRepository>(TYPES.IFollowRepository).to(FollowRepository);
container.bind<IReportRepository>(TYPES.IReportRepository).to(ReportRepository);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository);
container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository);
container
  .bind<ICommentRepository>(TYPES.ICommentRepository)
  .to(CommentRepository);
container
  .bind<IMessageRepository>(TYPES.IMessageRepository)
  .to(MessageRepository);
container
  .bind<IConversationRepository>(TYPES.IConversationRepository)
  .to(ConversationRepository);
container
  .bind<IUserActivityRepository>(TYPES.UserActivityRepository)
  .to(UserActivityRepository);

// --- BIND USE CASES ---
container.bind<AdminLogin>(TYPES.IAdminLogin).to(AdminLogin);
container.bind<AddComment>(TYPES.IAddComment).to(AddComment);
container
  .bind<CreateConversation>(TYPES.ICreateConversation)
  .to(CreateConversation);
container.bind<CreatePost>(TYPES.ICreatePost).to(CreatePost);
container.bind<CreateUser>(TYPES.ICreateUser).to(CreateUser);
container.bind<DeletePost>(TYPES.IDeletePost).to(DeletePost);
container.bind<EditPost>(TYPES.IEditPost).to(EditPost);
container.bind<GetAdminPosts>(TYPES.IGetAdminPosts).to(GetAdminPosts);
container.bind<GetAdminUsers>(TYPES.IGetAdminUsers).to(GetAdminUsers);
container.bind<GetComments>(TYPES.IGetComments).to(GetComments);
container.bind<GetConversation>(TYPES.IGetConversation).to(GetConversation);
container.bind<GetConversations>(TYPES.IGetConversations).to(GetConversations);
container.bind<GetFollowList>(TYPES.IGetFollowList).to(GetFollowList);
container.bind<GetLikedUsers>(TYPES.IGetLikedUsers).to(GetLikedUsers);
container.bind<GetMessages>(TYPES.IGetMessages).to(GetMessages);
container.bind<GetPostById>(TYPES.IGetPostById).to(GetPostById);
container.bind<GetPosts>(TYPES.IGetPosts).to(GetPosts);
container.bind<GetSavedPosts>(TYPES.IGetSavedPosts).to(GetSavedPosts);
container.bind<FetchUser>(TYPES.IFetchUser).to(FetchUser);
container.bind<GetUserProfile>(TYPES.IGetUserProfile).to(GetUserProfile);
container.bind<LoginUser>(TYPES.ILoginUser).to(LoginUser);
container
  .bind<MarkMessageAsSeen>(TYPES.IMarkMessageAsSeen)
  .to(MarkMessageAsSeen);
container
  .bind<RecordUserActivity>(TYPES.IRecordUserActivity)
  .to(RecordUserActivity);
container.bind<RefreshToken>(TYPES.IRefreshToken).to(RefreshToken);
container.bind<ReportTarget>(TYPES.IReportTarget).to(ReportTarget);
container.bind<SearchContent>(TYPES.ISearchContent).to(SearchContent);
container.bind<SendMessage>(TYPES.ISendMessage).to(SendMessage);
container
  .bind<SendVerificationEmail>(TYPES.ISendVerificationEmail)
  .to(SendVerificationEmail);
container.bind<SignInWithGoogle>(TYPES.ISignInWithGoogle).to(SignInWithGoogle);
container.bind<SuggestUser>(TYPES.ISuggestUser).to(SuggestUser);
container.bind<ToggleFollow>(TYPES.IToggleFollow).to(ToggleFollow);
container.bind<ToggleLike>(TYPES.IToggleLike).to(ToggleLike);
container.bind<TogglePostStatus>(TYPES.ITogglePostStatus).to(TogglePostStatus);
container.bind<ToggleSavePost>(TYPES.IToggleSavePost).to(ToggleSavePost);
container.bind<ToggleUserStatus>(TYPES.IToggleUserStatus).to(ToggleUserStatus);
container.bind<UpdateProfile>(TYPES.IUpdateProfile).to(UpdateProfile);
container.bind<VerifyOtp>(TYPES.IVerifyOtp).to(VerifyOtp);
container
  .bind<RequestPasswordReset>(TYPES.IRequestPasswordReset)
  .to(RequestPasswordReset);
container.bind<ResetPassword>(TYPES.IResetPassword).to(ResetPassword);
container.bind<GetDashboardData>(TYPES.IGetDashboardData).to(GetDashboardData);

// --- BIND CONTROLLER ---
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<PostController>(TYPES.PostController).to(PostController);
container
  .bind<CommentController>(TYPES.CommentController)
  .to(CommentController);
container
  .bind<ConversationController>(TYPES.ConversationController)
  .to(ConversationController);
container.bind<FollowController>(TYPES.FollowController).to(FollowController);
container.bind<LikeController>(TYPES.LikeController).to(LikeController);
container
  .bind<ProfileController>(TYPES.ProfileController)
  .to(ProfileController);
container.bind<ReportController>(TYPES.ReportController).to(ReportController);
container.bind<SearchController>(TYPES.SearchController).to(SearchController);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<SocketController>(TYPES.SocketController).to(SocketController);
container.bind<CallController>(TYPES.CallController).to(CallController);

// --- BIND CONSTANTS ---
container.bind<SocketActiveUsers>(TYPES.SocketActiveUsers).toConstantValue({});

export default container;
