import { Container } from "inversify";
import { TYPES } from "./types";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { IPasswordHasher } from "../application/services/IPasswordHasher";
import { BcryptPasswordHasher } from "../infrastructure/services/BcryptPasswordHasher";
import { CreateUser } from "../application/use-cases/CreateUser";
import { IFileStorageService } from "../application/services/IFileStorageService";
import { CloudinaryStorageService } from "../infrastructure/services/CloudinaryStorageService";
import { ITokenService } from "../application/services/ITokenService";
import { JwtTokenService } from "../infrastructure/services/JwtTokenService";
import { IMailService } from "../application/services/IMailService";
import { MailService } from "../infrastructure/services/MailService";
import { IOtpService } from "../application/services/IOtpService";
import { OtpService } from "../infrastructure/services/OtpService";
import { ICommentRepository } from "../domain/repositories/ICommentRepository";
import { CommentRepository } from "../infrastructure/repositories/CommentRepository";
import { IConversationRepository } from "../domain/repositories/IConversationRepository";
import { ConversationRepository } from "../infrastructure/repositories/ConversationRepository";
import { IFollowRepository } from "../domain/repositories/IFollowRepository";
import { FollowRepository } from "../infrastructure/repositories/FollowRepository";
import { ILikeRepository } from "../domain/repositories/ILikeRepository";
import { LikeRepository } from "../infrastructure/repositories/LikeRepository";
import { IMessageRepository } from "../domain/repositories/IMessageRepository";
import { MessageRepository } from "../infrastructure/repositories/MessageRepository";
import { IOtpRepository } from "../domain/repositories/IOtpRepository";
import { OtpRepository } from "../infrastructure/repositories/OtpRepository";
import { IPostRepository } from "../domain/repositories/IPostRepository";
import { PostRepository } from "../infrastructure/repositories/PostRepository";
import { IReportRepository } from "../domain/repositories/IReportRepository";
import { ReportRepository } from "../infrastructure/repositories/ReportRepository";
import { IInteractionRepository } from "../domain/repositories/IInteractionRepository";
import { InteractionRepository } from "../infrastructure/repositories/InteractionRepository";
import { AddComment } from "../application/use-cases/AddComment";
import { AdminLogin } from "../application/use-cases/AdminLogin";
import { CreateConversation } from "../application/use-cases/CreateConversation";
import { CreatePost } from "../application/use-cases/CreatePost";
import { DeletePost } from "../application/use-cases/DeletePost";
import { EditPost } from "../application/use-cases/EditPost";
import { GetAdminPosts } from "../application/use-cases/GetAdminPosts";
import { GetAdminUsers } from "../application/use-cases/GetAdminUsers";
import { GetComments } from "../application/use-cases/GetComments";
import { GetConversationId } from "../application/use-cases/GetConversationId";
import { GetConversations } from "../application/use-cases/GetConversations";
import { GetFollowList } from "../application/use-cases/GetFollowList";
import { GetLikedUsers } from "../application/use-cases/GetLikedUsers";
import { GetMessages } from "../application/use-cases/GetMessages";
import { GetPostById } from "../application/use-cases/GetPostById";
import { GetSavedPosts } from "../application/use-cases/GetSavedPosts";
import { GetUserDataForForm } from "../application/use-cases/GetUserDataForForm";
import { GetUserProfile } from "../application/use-cases/GetUserProfile";
import { LoginUser } from "../application/use-cases/LoginUser";
import { MarkMessageAsSeen } from "../application/use-cases/MarkMessageAsSeen";
import { RefreshToken } from "../application/use-cases/RefreshToken";
import { ReportTarget } from "../application/use-cases/ReportTarget";
import { SearchContent } from "../application/use-cases/SearchContent";
import { SendMessage } from "../application/use-cases/SendMessage";
import { SendVerificationEmail } from "../application/use-cases/SendVerificationEmail";
import { SignInWithGoogle } from "../application/use-cases/SignInWithGoogle";
import { ToggleFollow } from "../application/use-cases/ToggleFollow";
import { ToggleLike } from "../application/use-cases/ToggleLike";
import { TogglePostStatus } from "../application/use-cases/TogglePostStatus";
import { ToggleSavePost } from "../application/use-cases/ToggleSavePost";
import { ToggleUserStatus } from "../application/use-cases/ToggleUserStatus";
import { UpdateProfile } from "../application/use-cases/UpdateProfile";
import { VerifyOtp } from "../application/use-cases/VerifyOtp";
import { RecordInteraction } from "../application/use-cases/RecordInteraction";
import { GetRecommendedPosts } from "../application/use-cases/GetRecommendedPosts";

// Create a new container
const container = new Container();

// --- BIND SERVICES ---
container.bind<IPasswordHasher>(TYPES.IPasswordHasher).to(BcryptPasswordHasher);
container.bind<ITokenService>(TYPES.ITokenService).to(JwtTokenService);
container.bind<IMailService>(TYPES.IMailService).to(MailService);
container.bind<IOtpService>(TYPES.IOtpService).to(OtpService);
container
  .bind<IFileStorageService>(TYPES.IFileStorageService)
  .to(CloudinaryStorageService);

// --- BIND REPOSITORIES ---
container.bind<IFollowRepository>(TYPES.IFollowRepository).to(FollowRepository);
container.bind<IReportRepository>(TYPES.IReportRepository).to(ReportRepository);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository);
container.bind<ILikeRepository>(TYPES.ILikeRepository).to(LikeRepository);
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
  .bind<IInteractionRepository>(TYPES.InteractionRepository)
  .to(InteractionRepository);

// --- BIND USE CASES ---
container.bind<AdminLogin>(TYPES.AdminLogin).to(AdminLogin);
container.bind<AddComment>(TYPES.AddComment).to(AddComment);
container
  .bind<CreateConversation>(TYPES.CreateConversation)
  .to(CreateConversation);
container.bind<CreatePost>(TYPES.CreatePost).to(CreatePost);
container.bind<CreateUser>(TYPES.CreateUser).to(CreateUser);
container.bind<DeletePost>(TYPES.DeletePost).to(DeletePost);
container.bind<EditPost>(TYPES.EditPost).to(EditPost);
container.bind<GetAdminPosts>(TYPES.GetAdminPosts).to(GetAdminPosts);
container.bind<GetAdminUsers>(TYPES.GetAdminUsers).to(GetAdminUsers);
container.bind<GetComments>(TYPES.GetComments).to(GetComments);
container
  .bind<GetConversationId>(TYPES.GetConversationId)
  .to(GetConversationId);
container.bind<GetConversations>(TYPES.GetConversations).to(GetConversations);
container.bind<GetFollowList>(TYPES.GetFollowList).to(GetFollowList);
container.bind<GetLikedUsers>(TYPES.GetLikedUsers).to(GetLikedUsers);
container.bind<GetMessages>(TYPES.GetMessages).to(GetMessages);
container.bind<GetPostById>(TYPES.GetPostById).to(GetPostById);
container
  .bind<GetRecommendedPosts>(TYPES.GetRecommendedPosts)
  .to(GetRecommendedPosts);
container.bind<GetSavedPosts>(TYPES.GetSavedPosts).to(GetSavedPosts);
container
  .bind<GetUserDataForForm>(TYPES.GetUserDataForForm)
  .to(GetUserDataForForm);
container.bind<GetUserProfile>(TYPES.GetUserProfile).to(GetUserProfile);
container.bind<LoginUser>(TYPES.LoginUser).to(LoginUser);
container
  .bind<MarkMessageAsSeen>(TYPES.MarkMessageAsSeen)
  .to(MarkMessageAsSeen);
container
  .bind<RecordInteraction>(TYPES.RecordInteraction)
  .to(RecordInteraction);
container.bind<RefreshToken>(TYPES.RefreshToken).to(RefreshToken);
container.bind<ReportTarget>(TYPES.ReportTarget).to(ReportTarget);
container.bind<SearchContent>(TYPES.SearchContent).to(SearchContent);
container.bind<SendMessage>(TYPES.SendMessage).to(SendMessage);
container
  .bind<SendVerificationEmail>(TYPES.SendVerificationEmail)
  .to(SendVerificationEmail);
container.bind<SignInWithGoogle>(TYPES.SignInWithGoogle).to(SignInWithGoogle);
container.bind<ToggleFollow>(TYPES.ToggleFollow).to(ToggleFollow);
container.bind<ToggleLike>(TYPES.ToggleLike).to(ToggleLike);
container.bind<TogglePostStatus>(TYPES.TogglePostStatus).to(TogglePostStatus);
container.bind<ToggleSavePost>(TYPES.ToggleSavePost).to(ToggleSavePost);
container.bind<ToggleUserStatus>(TYPES.ToggleUserStatus).to(ToggleUserStatus);
container.bind<UpdateProfile>(TYPES.UpdateProfile).to(UpdateProfile);
container.bind<VerifyOtp>(TYPES.VerifyOtp).to(VerifyOtp);

export default container;
