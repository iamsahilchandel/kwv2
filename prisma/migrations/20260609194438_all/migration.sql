-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "FcmUserType" AS ENUM ('admin', 'center', 'expert', 'learner');

-- CreateEnum
CREATE TYPE "ServiceGroup" AS ENUM ('Sports and Physical Activities', 'Dance and Fitness', 'Music and Performing Arts', 'Art and Creativity', 'Academic and Skill Development');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('super-admin', 'admin', 'admin-account', 'sales-head', 'area-sales-manager', 'sales-executive', 'onboarding-team', 'curriculum-team', 'marketing-head');

-- CreateEnum
CREATE TYPE "CenterInquiryStatus" AS ENUM ('new', 'contacted', 'interested', 'qualified', 'unqualified', 'in-process', 'follow-up', 'converted', 'lost', 'no-response', 'duplicate', 'onboarded', 'verified', 'verification-rejected');

-- CreateEnum
CREATE TYPE "CenterMediaType" AS ENUM ('gallery-image', 'testimonial-video', 'gallery-video', 'center-certificates', 'logo', 'qr-code');

-- CreateEnum
CREATE TYPE "CenterOperatingEntity" AS ENUM ('rwa', 'school', 'owner', 'maintenance');

-- CreateEnum
CREATE TYPE "CenterVerificationStatus" AS ENUM ('verified', 'pending', 'rejected');

-- CreateEnum
CREATE TYPE "CenterType" AS ENUM ('clubhouse-apartment-complex', 'clubhouse-residential', 'society', 'professional-center', 'school', 'others');

-- CreateEnum
CREATE TYPE "CenterStaffRole" AS ENUM ('center-admin', 'center-head');

-- CreateEnum
CREATE TYPE "VerificationMode" AS ENUM ('manual', 'api');

-- CreateEnum
CREATE TYPE "CenterStaffDocumentType" AS ENUM ('aadhaar-front', 'aadhaar-back', 'pan-card');

-- CreateEnum
CREATE TYPE "CenterDocumentType" AS ENUM ('aadhaar-front', 'aadhaar-back', 'pan-card', 'pass-or-cheque', 'gst');

-- CreateEnum
CREATE TYPE "CenterPaymentMethod" AS ENUM ('gateway', 'upi', 'poc', 'qr', 'coupon');

-- CreateEnum
CREATE TYPE "ExpertDocumentType" AS ENUM ('aadhaar-front', 'aadhaar-back', 'pan-card', 'passport', 'driving-license');

-- CreateEnum
CREATE TYPE "ExpertMediaType" AS ENUM ('gallery-image', 'gallery-video', 'testimonial-video', 'certificates', 'demo-video');

-- CreateEnum
CREATE TYPE "LearnerMediaType" AS ENUM ('profile-pic');

-- CreateEnum
CREATE TYPE "LearnerKycDocumentType" AS ENUM ('aadhaar-front', 'aadhaar-back');

-- CreateEnum
CREATE TYPE "AgreementType" AS ENUM ('expert-center', 'learner-center', 'center-platform');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('learner', 'expert', 'admin');

-- CreateEnum
CREATE TYPE "BatchType" AS ENUM ('ongoing', 'workshop', 'camp', 'trial', 'competition');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('active', 'inactive', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled', 'reschedule-requested');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('enrolled', 'cancelled', 'completed', 'rescheduled', 'pending', 'refunded', 'rejected');

-- CreateEnum
CREATE TYPE "BatchRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent', 'late', 'rescheduled', 'excused', 'pending');

-- CreateEnum
CREATE TYPE "BenefitType" AS ENUM ('skill_development', 'certification', 'career_guidance', 'networking', 'resource_access', 'mentorship', 'other');

-- CreateEnum
CREATE TYPE "TrialRequestStatus" AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'authorized', 'successful', 'failed', 'cancelled', 'refunded', 'expired', 'rejected', 'pending_verification');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('credit_card', 'debit_card', 'net_banking', 'upi', 'wallet', 'cash', 'cheque', 'other', 'pac', 'poc', 'coupon');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('center_onboarding', 'center_subscription', 'expert_subscription', 'learner_subscription', 'batch_payment');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('pending', 'generated', 'sent', 'viewed');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('advance-payment', 'coupon');

-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "SettingValueType" AS ENUM ('string', 'number', 'boolean', 'json', 'datetime');

-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('center', 'learner', 'expert', 'all');

-- CreateEnum
CREATE TYPE "UpdateRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TemplateSyncStatus" AS ENUM ('pending', 'synced', 'partial_failure');

-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- CreateEnum
CREATE TYPE "InterestInitiator" AS ENUM ('expert', 'center');

-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('regular', 'trial');

-- CreateEnum
CREATE TYPE "BatchMediaType" AS ENUM ('image', 'video', 'document', 'audio', 'presentation', 'curriculum', 'brochure');

-- CreateEnum
CREATE TYPE "BatchClassMediaType" AS ENUM ('image', 'video', 'document', 'audio');

-- CreateEnum
CREATE TYPE "MediaVisibility" AS ENUM ('all', 'specific');

-- CreateEnum
CREATE TYPE "MediaAccessType" AS ENUM ('view', 'download', 'full');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('pending', 'sent', 'failed');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('android', 'ios', 'web', 'desktop');

-- CreateEnum
CREATE TYPE "ReferralEntityType" AS ENUM ('learner', 'expert', 'center');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('pending', 'completed', 'rewarded', 'used');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('pending', 'approved', 'rejected', 'revised');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('monthly', 'quarterly', 'yearly');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('SUCCESS', 'FAILED', 'USER_DROPPED', 'REFUND_SUCCESS', 'REFUND_FAILED', 'AUTO_REFUND_SUCCESS', 'AUTO_REFUND_FAILED');

-- CreateEnum
CREATE TYPE "PaymentGroup" AS ENUM ('credit_card', 'debit_card', 'net_banking', 'upi', 'wallet', 'credit_card_emi', 'debit_card_emi', 'cardless_emi', 'pay_later');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('active', 'expired', 'disabled', 'depleted');

-- CreateEnum
CREATE TYPE "CouponApplication" AS ENUM ('all', 'center_payment', 'batch_enrollment');

-- CreateEnum
CREATE TYPE "CouponModule" AS ENUM ('center_payment', 'batch_enrollment');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'processed');

-- CreateEnum
CREATE TYPE "AccessRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('resident', 'member', 'guest', 'employee', 'family', 'other');

-- CreateEnum
CREATE TYPE "RequesterType" AS ENUM ('expert', 'learner');

-- CreateEnum
CREATE TYPE "RescheduleRequestStatus" AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('active', 'closed');

-- CreateEnum
CREATE TYPE "PollResponse" AS ENUM ('available', 'unavailable');

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "service_group" "ServiceGroup",
    "service_name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" BIGINT,
    "last_modified_by" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenities" (
    "id" SERIAL NOT NULL,
    "amenity_name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_settings" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "key_name" VARCHAR(100) NOT NULL,
    "value_type" "SettingValueType" NOT NULL,
    "string_value" TEXT,
    "number_value" DECIMAL(15,4),
    "boolean_value" BOOLEAN,
    "json_value" JSONB,
    "datetime_value" TIMESTAMP(3),
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_general_documents" (
    "id" SERIAL NOT NULL,
    "document_title" TEXT NOT NULL,
    "document_type" TEXT,
    "document_url" TEXT NOT NULL,
    "document_key" TEXT NOT NULL,
    "created_by" BIGINT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_general_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertising_banners" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_key" TEXT NOT NULL,
    "link_url" TEXT,
    "type" "BannerType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertising_banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_admin_staff" (
    "id" SERIAL NOT NULL,
    "firebase_uid" TEXT,
    "full_name" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "role" "AdminRole" NOT NULL,
    "reports_to" INTEGER,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_admin_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_staff" (
    "id" SERIAL NOT NULL,
    "firebase_uid" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT,
    "phone_number" TEXT NOT NULL,
    "address" JSONB,
    "joined_on" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experts" (
    "id" SERIAL NOT NULL,
    "firebase_uid" TEXT,
    "center_id" INTEGER,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "address" JSONB,
    "location_for_work" geometry(Point),
    "range_for_work" INTEGER DEFAULT 5000,
    "profile_picture" TEXT,
    "media_key" TEXT,
    "gender" "Gender" NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_on" TIMESTAMP(3),
    "verified_by" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "is_open_for_work" BOOLEAN NOT NULL DEFAULT false,
    "preferred_working_time_slots" JSONB,
    "terms_and_conditions_accepted" BOOLEAN NOT NULL DEFAULT false,
    "terms_and_conditions_accepted_on" TIMESTAMP(3),
    "is_freelancer" BOOLEAN NOT NULL DEFAULT false,
    "referral_code" TEXT,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learners" (
    "id" SERIAL NOT NULL,
    "profile_id" BIGINT,
    "firebase_uid" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT,
    "phone_number" BIGINT NOT NULL,
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "terms_accepted_on" TIMESTAMP(3),
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_profiles" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "address" JSONB,
    "gender" "Gender",
    "profile_picture" TEXT,
    "profile_picture_key" TEXT,
    "relation" TEXT,
    "location" geometry(Point),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_on" TIMESTAMP(3),
    "verified_by" INTEGER,
    "referral_code" TEXT,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_inquiries" (
    "id" SERIAL NOT NULL,
    "center_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "website" TEXT,
    "status" "CenterInquiryStatus" NOT NULL,
    "assigned_by" INTEGER,
    "assigned_to" INTEGER,
    "services_available" TEXT[],
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center" (
    "id" SERIAL NOT NULL,
    "center_inquiry_id" INTEGER,
    "center_name" TEXT NOT NULL,
    "center_head_id" INTEGER,
    "established_date" TIMESTAMP(3),
    "number_of_employees" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "daily_operating_hours" JSONB NOT NULL,
    "address" JSONB NOT NULL,
    "geo_location" geometry(Point, 4326),
    "website" TEXT,
    "center_type" "CenterType",
    "operating_entity" "CenterOperatingEntity",
    "is_notify_by_email" BOOLEAN NOT NULL DEFAULT false,
    "is_notify_by_push_alert" BOOLEAN NOT NULL DEFAULT false,
    "is_notify_by_sms" BOOLEAN NOT NULL DEFAULT false,
    "is_notify_by_whatsapp" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "approved_by" INTEGER,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "reason_for_not_verified" TEXT[],
    "is_onboarding_payment_received" BOOLEAN NOT NULL DEFAULT false,
    "onboarding_payment_verified_by" INTEGER,
    "is_onboarding_payment_verified" BOOLEAN NOT NULL DEFAULT false,
    "onboarding_payment_received_on" TIMESTAMP(3),
    "onboarding_payment_received_by" INTEGER,
    "is_onboarding_payment_rejected" BOOLEAN NOT NULL DEFAULT false,
    "onboarding_payment_rejected_by" INTEGER,
    "onboarding_payment_rejected_on" TIMESTAMP(3),
    "onboarding_payment_rejection_reason" TEXT[],
    "onboarding_payment_method" "CenterPaymentMethod",
    "onboarding_payment_ss" TEXT,
    "onboarding_payment_ss_key" TEXT,
    "onboarding_payment_gateway_method" TEXT,
    "onboarding_payment_amount" DECIMAL(15,2),
    "onboarding_payment_transaction_id" TEXT,
    "onboarding_payment_order_id" TEXT,
    "commission_percentage" DECIMAL(10,2),
    "approval_date" TIMESTAMP(3),
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "terms_accepted_on" TIMESTAMP(3),
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "coupon" TEXT,
    "coupon_applied_on" TIMESTAMP(3),
    "original_onboarding_amount" DECIMAL(15,2),
    "subscription_amount" DECIMAL(15,2),
    "batch_tax_percentage" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_about_us" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER NOT NULL,
    "center_description" TEXT,
    "vision" TEXT,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_about_us_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_bank_details" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER,
    "account_holder_name" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "ifsc_code" TEXT NOT NULL,
    "branch_address" JSONB,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_bank_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_media" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER NOT NULL,
    "media_type" "CenterMediaType" NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_key" TEXT NOT NULL,
    "content_type" TEXT,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_verification" (
    "id" SERIAL NOT NULL,
    "doc_identity_number" TEXT,
    "document_type" "CenterDocumentType" NOT NULL,
    "document_url" TEXT,
    "media_key" TEXT,
    "verification_mode" "VerificationMode" NOT NULL DEFAULT 'manual',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" INTEGER,
    "center_id" INTEGER,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_staff_verification" (
    "id" BIGSERIAL NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "doc_identity_number" TEXT,
    "document_type" TEXT NOT NULL,
    "document_url" TEXT NOT NULL,
    "media_key" TEXT,
    "verification_mode" "VerificationMode" NOT NULL DEFAULT 'manual',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" INTEGER,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_staff_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_amenities" (
    "centerId" INTEGER NOT NULL,
    "amenityId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_amenities_pkey" PRIMARY KEY ("centerId","amenityId")
);

-- CreateTable
CREATE TABLE "center_services" (
    "centerId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_services_pkey" PRIMARY KEY ("centerId","serviceId")
);

-- CreateTable
CREATE TABLE "center_has_many_staff" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "role" "CenterStaffRole" NOT NULL,
    "joined_on" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_has_many_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_has_many_experts" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "joined_on" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "center_has_many_experts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_inquiry_note" (
    "id" SERIAL NOT NULL,
    "center_inquiry_id" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "admin_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_inquiry_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "future_proposed_activities" (
    "id" BIGSERIAL NOT NULL,
    "service_id" INTEGER,
    "activity" VARCHAR(255),
    "center_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "future_proposed_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "update_center_details_request" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER NOT NULL,
    "center_name" TEXT,
    "established_date" DATE,
    "number_of_employees" INTEGER,
    "email" TEXT,
    "phone_number" TEXT,
    "daily_operating_hours" JSONB,
    "address" JSONB,
    "geo_location" geometry(Point, 4326),
    "website" TEXT,
    "center_type" "CenterType",
    "operating_entity" "CenterOperatingEntity",
    "is_notify_by_email" BOOLEAN,
    "is_notify_by_push_alert" BOOLEAN,
    "is_notify_by_sms" BOOLEAN,
    "is_notify_by_whatsapp" BOOLEAN,
    "is_public" BOOLEAN DEFAULT true,
    "amenities" INTEGER[],
    "services" INTEGER[],
    "center_description" TEXT,
    "vision" TEXT,
    "center_bank_account_holder_name" TEXT,
    "center_bank_account_number" TEXT,
    "center_bank_name" TEXT,
    "center_ifsc_code" TEXT,
    "center_branch_address" JSONB,
    "center_media" JSONB[],
    "center_verification" JSONB[],
    "status" "UpdateRequestStatus" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "approved_on" TIMESTAMP(3),
    "rejected_on" TIMESTAMP(3),
    "approved_by" INTEGER,
    "rejected_by" INTEGER,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "update_center_details_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_whatsapp_configs" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER NOT NULL,
    "waba_id" TEXT NOT NULL,
    "phone_number_id" TEXT NOT NULL,
    "display_number" TEXT NOT NULL,
    "business_name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "template_sync_status" "TemplateSyncStatus" NOT NULL DEFAULT 'pending',
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_whatsapp_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_about" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "expert_description" TEXT NOT NULL,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_about_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_media" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "media_type" "ExpertMediaType" NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_key" TEXT NOT NULL,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,

    CONSTRAINT "expert_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_kyc_verification" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "document_type" "ExpertDocumentType" NOT NULL,
    "document_number" TEXT NOT NULL,
    "document_url" TEXT NOT NULL,
    "media_key" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" INTEGER,
    "verification_mode" "VerificationMode" NOT NULL DEFAULT 'manual',
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_kyc_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_experties" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "experties_id" INTEGER NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_experties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_center_interest" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "center_id" INTEGER NOT NULL,
    "initiator" "InterestInitiator" NOT NULL,
    "status" "InterestStatus" NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "preferred_working_time_slots" JSONB,
    "experience_years" INTEGER,
    "expected_compensation" DECIMAL(15,2),
    "offered_compensation" DECIMAL(15,2),
    "response_message" TEXT,
    "response_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_center_interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_interest_services" (
    "id" SERIAL NOT NULL,
    "interest_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "experience_years" INTEGER,
    "preferred_for_service" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_interest_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "center_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "batch_name" TEXT NOT NULL,
    "description" TEXT,
    "batch_type" "BatchType" NOT NULL,
    "venue" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "frequency" JSONB NOT NULL,
    "number_of_classes" INTEGER,
    "expert_pay_per_class" DECIMAL(10,2),
    "base_price" DECIMAL(10,2) NOT NULL,
    "allow_mid_term_joining" BOOLEAN NOT NULL,
    "require_expert_confirmation" BOOLEAN NOT NULL,
    "minimum_classes_booking" INTEGER NOT NULL DEFAULT 1,
    "number_of_seats" INTEGER,
    "status" "BatchStatus" NOT NULL DEFAULT 'active',
    "minimum_classes_cutoff_date" TIMESTAMP(3),
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_classes" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "class_date" DATE NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "status" "ClassStatus" NOT NULL DEFAULT 'scheduled',
    "expert_id" INTEGER,
    "class_type" "ClassType" NOT NULL DEFAULT 'regular',
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_class_history" (
    "id" SERIAL NOT NULL,
    "batch_class_id" INTEGER NOT NULL,
    "status" "ClassStatus" NOT NULL,
    "class_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "expert_id" INTEGER,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_class_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_enrollments" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "paid_amount" DECIMAL(10,2) NOT NULL,
    "number_of_classes_paid" INTEGER NOT NULL,
    "status" "EnrollmentStatus" NOT NULL,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_class_attendence" (
    "id" SERIAL NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,
    "batch_enrollment_id" INTEGER NOT NULL,
    "batch_class_id" INTEGER NOT NULL,
    "attendance_status" "AttendanceStatus" NOT NULL DEFAULT 'pending',
    "rescheduled_class_id" INTEGER,
    "rescheduling_reason" TEXT,
    "rescheduling_request_id" INTEGER,
    "attendance_marked_by" INTEGER,
    "attendance_marked_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_class_attendence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_media" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "media_type" "BatchMediaType" NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_key" TEXT NOT NULL,
    "media_title" TEXT,
    "media_description" TEXT,
    "content_type" TEXT,
    "file_size" BIGINT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER DEFAULT 0,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_benefits" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "benefit_title" TEXT NOT NULL,
    "benefit_description" TEXT,
    "benefit_type" "BenefitType" NOT NULL DEFAULT 'other',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER DEFAULT 0,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_requests" (
    "id" SERIAL NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "center_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "batch_name" TEXT NOT NULL,
    "description" TEXT,
    "batch_type" TEXT NOT NULL,
    "venue" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "frequency" JSONB NOT NULL,
    "number_of_classes" INTEGER,
    "expert_pay_per_class" DECIMAL(10,2) NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "allow_mid_term_joining" BOOLEAN NOT NULL DEFAULT false,
    "require_expert_confirmation" BOOLEAN NOT NULL DEFAULT true,
    "minimum_classes_booking" INTEGER NOT NULL DEFAULT 1,
    "number_of_seats" INTEGER,
    "request_status" "BatchRequestStatus" NOT NULL DEFAULT 'pending',
    "request_message" TEXT,
    "rejection_reason" TEXT,
    "approved_by" INTEGER,
    "approved_at" TIMESTAMP(3),
    "batch_id" INTEGER,
    "notes" TEXT,
    "metadata" JSONB,
    "benefits" JSONB,
    "media" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_class_media" (
    "id" SERIAL NOT NULL,
    "batch_class_id" INTEGER NOT NULL,
    "expert_id" INTEGER NOT NULL,
    "media_type" "BatchClassMediaType" NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" BIGINT,
    "mime_type" TEXT,
    "title" TEXT,
    "description" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "media_visibility" "MediaVisibility" NOT NULL DEFAULT 'all',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_class_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_class_media_access" (
    "id" SERIAL NOT NULL,
    "batch_class_media_id" INTEGER NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granted_by" BIGINT,
    "access_type" "MediaAccessType" NOT NULL DEFAULT 'full',
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_class_media_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_reschedule_requests" (
    "id" SERIAL NOT NULL,
    "center_id" INTEGER NOT NULL,
    "batch_class_id" INTEGER NOT NULL,
    "requester_type" "RequesterType" NOT NULL,
    "requester_id" BIGINT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "RescheduleRequestStatus" NOT NULL DEFAULT 'pending',
    "proposed_schedule" JSONB,
    "admin_notes" TEXT,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_reschedule_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reschedule_polls" (
    "id" SERIAL NOT NULL,
    "reschedule_request_id" INTEGER,
    "poll_status" "PollStatus" NOT NULL DEFAULT 'active',
    "closing_date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "center_id" INTEGER,
    "batch_class_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reschedule_polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reschedule_poll_options" (
    "id" SERIAL NOT NULL,
    "poll_id" INTEGER NOT NULL,
    "proposed_date" TIMESTAMP(3) NOT NULL,
    "proposed_start_time" TIME(6) NOT NULL,
    "proposed_end_time" TIME(6) NOT NULL,
    "option_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reschedule_poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reschedule_poll_responses" (
    "id" SERIAL NOT NULL,
    "poll_option_id" INTEGER NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,
    "response" "PollResponse" NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reschedule_poll_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trial_requests" (
    "id" SERIAL NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "status" "TrialRequestStatus" NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT[],
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trial_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "enrollment_id" INTEGER,
    "learner_profile_id" INTEGER,
    "center_id" INTEGER,
    "expert_id" INTEGER,
    "order_id" TEXT NOT NULL,
    "order_token" TEXT,
    "base_amount" DECIMAL(10,2) NOT NULL,
    "convenience_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "platform_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "commission" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "payment_method" TEXT,
    "payment_date" TIMESTAMP(3),
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "transaction_id" TEXT,
    "payment_gateway_response" JSONB,
    "receipt_url" TEXT,
    "refund_id" TEXT,
    "refund_status" TEXT,
    "refund_amount" DECIMAL(10,2),
    "refund_date" TIMESTAMP(3),
    "subscription_period_start" TIMESTAMP(3),
    "subscription_period_end" TIMESTAMP(3),
    "subscription_type" "SubscriptionType",
    "notes" TEXT,
    "metadata" JSONB,
    "invoice_number" TEXT,
    "invoice_url" TEXT,
    "invoice_key" TEXT,
    "invoice_generated_at" TIMESTAMP(3),
    "invoice_status" "InvoiceStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "order_amount" DOUBLE PRECISION NOT NULL,
    "order_currency" TEXT NOT NULL DEFAULT 'INR',
    "order_tags" JSONB,
    "cf_payment_id" TEXT NOT NULL,
    "payment_status" "TransactionStatus" NOT NULL,
    "payment_amount" DOUBLE PRECISION NOT NULL,
    "payment_currency" TEXT NOT NULL DEFAULT 'INR',
    "payment_message" TEXT,
    "payment_time" TIMESTAMP(3),
    "bank_reference" TEXT,
    "auth_id" TEXT,
    "payment_method" JSONB,
    "payment_group" "PaymentGroup",
    "customer_name" TEXT,
    "customer_id" TEXT,
    "customer_email" TEXT,
    "customer_phone" TEXT,
    "error_details" JSONB,
    "gateway_name" TEXT,
    "gateway_order_id" TEXT,
    "gateway_payment_id" TEXT,
    "gateway_order_reference_id" TEXT,
    "gateway_settlement" TEXT,
    "gateway_status_code" TEXT,
    "payment_offers" JSONB,
    "cf_refund_id" TEXT,
    "refund_id" TEXT,
    "refund_amount" DOUBLE PRECISION,
    "refund_currency" TEXT,
    "refund_type" TEXT,
    "refund_arn" TEXT,
    "refund_status" TEXT,
    "status_description" TEXT,
    "refund_created_at" TIMESTAMP(3),
    "refund_processed_at" TIMESTAMP(3),
    "refund_charge" DOUBLE PRECISION,
    "refund_note" TEXT,
    "refund_splits" JSONB,
    "refund_mode" TEXT,
    "refund_reason" TEXT,
    "event_time" TIMESTAMP(3),
    "event_type" TEXT,
    "webhook_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "type" "CouponType" NOT NULL DEFAULT 'percentage',
    "value" DECIMAL(10,2) NOT NULL,
    "min_purchase_amount" DECIMAL(10,2),
    "max_discount_amount" DECIMAL(10,2),
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "usage_limit" INTEGER,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "user_usage_limit" INTEGER,
    "status" "CouponStatus" NOT NULL DEFAULT 'active',
    "applicable_to" "CouponApplication" NOT NULL DEFAULT 'all',
    "center_id" INTEGER,
    "learner_id" INTEGER,
    "expert_id" INTEGER,
    "batch_id" INTEGER,
    "is_first_purchase_only" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_redemption" (
    "id" SERIAL NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "learner_id" INTEGER,
    "center_id" INTEGER,
    "expert_id" INTEGER,
    "payment_id" INTEGER,
    "discount_amount" DECIMAL(10,2) NOT NULL,
    "original_amount" DECIMAL(10,2) NOT NULL,
    "final_amount" DECIMAL(10,2) NOT NULL,
    "is_full_payment" BOOLEAN NOT NULL DEFAULT false,
    "redeemed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "module" "CouponModule" NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupon_redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment_refund_requests" (
    "id" SERIAL NOT NULL,
    "enrollment_id" INTEGER NOT NULL,
    "request_reason" TEXT NOT NULL,
    "refund_amount" DECIMAL(10,2) NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'pending',
    "requested_by" INTEGER NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by" INTEGER,
    "approved_at" TIMESTAMP(3),
    "rejected_by" INTEGER,
    "rejected_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "processed_by" INTEGER,
    "processed_at" TIMESTAMP(3),
    "processed_amount" DECIMAL(10,2),
    "process_notes" TEXT,
    "supporting_document" TEXT,
    "supporting_document_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollment_refund_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" BIGSERIAL NOT NULL,
    "user_type" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "status" "NotificationStatus" NOT NULL DEFAULT 'pending',
    "sent_at" TIMESTAMP(3),
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firebase_token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_type" "FcmUserType" NOT NULL,
    "device_token" TEXT NOT NULL,
    "device_type" "DeviceType",
    "device_info" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "firebase_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral" (
    "id" SERIAL NOT NULL,
    "referrer_id" INTEGER NOT NULL,
    "referrer_type" "ReferralEntityType" NOT NULL,
    "referee_id" INTEGER NOT NULL,
    "referee_type" "ReferralEntityType" NOT NULL,
    "referral_code" VARCHAR(8) NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'pending',
    "reward_type" VARCHAR(50),
    "reward_value" DECIMAL(10,2),
    "coupon_code" VARCHAR(50),
    "rewarded_at" TIMESTAMP(3),
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreements" (
    "id" SERIAL NOT NULL,
    "agreement_type" "AgreementType" NOT NULL,
    "agreement_title" TEXT,
    "center_id" INTEGER NOT NULL,
    "signed_by_center_staff" INTEGER,
    "signed_by_expert" INTEGER,
    "signed_by_learner" INTEGER,
    "document_url" TEXT NOT NULL,
    "media_key" TEXT,
    "status" "AgreementStatus" NOT NULL DEFAULT 'pending',
    "approved_on" TIMESTAMP(3),
    "rejected_on" TIMESTAMP(3),
    "rejection_reason" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_media" (
    "id" SERIAL NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,
    "media_type" "LearnerMediaType" NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_key" TEXT NOT NULL,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learner_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_profile_kyc_verifications" (
    "id" SERIAL NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,
    "document_type" "LearnerKycDocumentType" NOT NULL,
    "document_number" TEXT,
    "document_url" TEXT NOT NULL,
    "media_key" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" INTEGER,
    "verification_mode" "VerificationMode" NOT NULL DEFAULT 'manual',
    "created_by" INTEGER,
    "last_modified_by" INTEGER,

    CONSTRAINT "learner_profile_kyc_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_has_many_profiles" (
    "id" BIGSERIAL NOT NULL,
    "learner_id" INTEGER NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,

    CONSTRAINT "learner_has_many_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_profile_has_many_centers" (
    "id" SERIAL NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,
    "center_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER,
    "last_modified_by" INTEGER,

    CONSTRAINT "learner_profile_has_many_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_center_access_requests" (
    "id" SERIAL NOT NULL,
    "learner_profile_id" INTEGER NOT NULL,
    "center_id" INTEGER NOT NULL,
    "request_status" "AccessRequestStatus" NOT NULL DEFAULT 'pending',
    "request_message" TEXT,
    "rejection_reason" TEXT,
    "approved_by" INTEGER,
    "approved_at" TIMESTAMP(3),
    "relationship_type" "RelationshipType",
    "verification_documents" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learner_center_access_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learners_interest" (
    "id" SERIAL NOT NULL,
    "learner_profile_id" INTEGER,
    "service_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learners_interest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_service_name_key" ON "services"("service_name");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_amenity_name_key" ON "amenities"("amenity_name");

-- CreateIndex
CREATE INDEX "idx_category" ON "platform_settings"("category");

-- CreateIndex
CREATE INDEX "idx_is_active" ON "platform_settings"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "platform_settings_category_key_name_key" ON "platform_settings"("category", "key_name");

-- CreateIndex
CREATE UNIQUE INDEX "app_admin_staff_firebase_uid_key" ON "app_admin_staff"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "app_admin_staff_email_key" ON "app_admin_staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "app_admin_staff_phone_number_key" ON "app_admin_staff"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "center_staff_phone_number_key" ON "center_staff"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "experts_phone_number_key" ON "experts"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "experts_referral_code_key" ON "experts"("referral_code");

-- CreateIndex
CREATE UNIQUE INDEX "experts_center_id_phone_number_key" ON "experts"("center_id", "phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "learners_firebase_uid_key" ON "learners"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "learners_email_key" ON "learners"("email");

-- CreateIndex
CREATE UNIQUE INDEX "learners_phone_number_key" ON "learners"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "learner_profiles_referral_code_key" ON "learner_profiles"("referral_code");

-- CreateIndex
CREATE UNIQUE INDEX "center_center_inquiry_id_key" ON "center"("center_inquiry_id");

-- CreateIndex
CREATE UNIQUE INDEX "center_phone_number_key" ON "center"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "center_has_many_experts_center_id_expert_id_key" ON "center_has_many_experts"("center_id", "expert_id");

-- CreateIndex
CREATE UNIQUE INDEX "center_whatsapp_configs_center_id_key" ON "center_whatsapp_configs"("center_id");

-- CreateIndex
CREATE INDEX "center_whatsapp_configs_center_id_idx" ON "center_whatsapp_configs"("center_id");

-- CreateIndex
CREATE INDEX "center_whatsapp_configs_waba_id_idx" ON "center_whatsapp_configs"("waba_id");

-- CreateIndex
CREATE UNIQUE INDEX "expert_interest_services_interest_id_service_id_key" ON "expert_interest_services"("interest_id", "service_id");

-- CreateIndex
CREATE INDEX "batch_media_batch_id_idx" ON "batch_media"("batch_id");

-- CreateIndex
CREATE INDEX "batch_media_media_type_idx" ON "batch_media"("media_type");

-- CreateIndex
CREATE INDEX "batch_media_is_public_idx" ON "batch_media"("is_public");

-- CreateIndex
CREATE INDEX "batch_benefits_batch_id_idx" ON "batch_benefits"("batch_id");

-- CreateIndex
CREATE INDEX "batch_benefits_benefit_type_idx" ON "batch_benefits"("benefit_type");

-- CreateIndex
CREATE INDEX "batch_benefits_is_active_idx" ON "batch_benefits"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "batch_requests_batch_id_key" ON "batch_requests"("batch_id");

-- CreateIndex
CREATE INDEX "batch_requests_expert_id_idx" ON "batch_requests"("expert_id");

-- CreateIndex
CREATE INDEX "batch_requests_center_id_idx" ON "batch_requests"("center_id");

-- CreateIndex
CREATE INDEX "batch_requests_status_idx" ON "batch_requests"("request_status");

-- CreateIndex
CREATE INDEX "batch_requests_expert_center_idx" ON "batch_requests"("expert_id", "center_id");

-- CreateIndex
CREATE INDEX "batch_requests_expert_status_idx" ON "batch_requests"("expert_id", "request_status");

-- CreateIndex
CREATE INDEX "batch_requests_center_status_idx" ON "batch_requests"("center_id", "request_status");

-- CreateIndex
CREATE INDEX "batch_requests_created_at_idx" ON "batch_requests"("created_at");

-- CreateIndex
CREATE INDEX "batch_requests_start_date_idx" ON "batch_requests"("start_date");

-- CreateIndex
CREATE INDEX "class_reschedule_requests_batch_class_id_idx" ON "class_reschedule_requests"("batch_class_id");

-- CreateIndex
CREATE INDEX "class_reschedule_requests_requester_type_requester_id_idx" ON "class_reschedule_requests"("requester_type", "requester_id");

-- CreateIndex
CREATE INDEX "class_reschedule_requests_status_idx" ON "class_reschedule_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "reschedule_poll_responses_poll_option_id_learner_profile_id_key" ON "reschedule_poll_responses"("poll_option_id", "learner_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_order_id_key" ON "payment"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_invoice_number_key" ON "payment"("invoice_number");

-- CreateIndex
CREATE INDEX "payment_payment_type_idx" ON "payment"("payment_type");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE INDEX "payment_enrollment_id_idx" ON "payment"("enrollment_id");

-- CreateIndex
CREATE INDEX "payment_learner_profile_id_idx" ON "payment"("learner_profile_id");

-- CreateIndex
CREATE INDEX "payment_center_id_idx" ON "payment"("center_id");

-- CreateIndex
CREATE INDEX "payment_expert_id_idx" ON "payment"("expert_id");

-- CreateIndex
CREATE INDEX "payment_payment_date_idx" ON "payment"("payment_date");

-- CreateIndex
CREATE INDEX "payment_subscription_period_start_subscription_period_end_idx" ON "payment"("subscription_period_start", "subscription_period_end");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_code_key" ON "coupon"("code");

-- CreateIndex
CREATE INDEX "idx_coupon_code" ON "coupon"("code");

-- CreateIndex
CREATE INDEX "idx_coupon_status" ON "coupon"("status");

-- CreateIndex
CREATE INDEX "idx_coupon_applicable_to" ON "coupon"("applicable_to");

-- CreateIndex
CREATE INDEX "idx_coupon_center_id" ON "coupon"("center_id");

-- CreateIndex
CREATE INDEX "idx_coupon_learner_id" ON "coupon"("learner_id");

-- CreateIndex
CREATE INDEX "idx_coupon_expert_id" ON "coupon"("expert_id");

-- CreateIndex
CREATE INDEX "idx_coupon_batch_id" ON "coupon"("batch_id");

-- CreateIndex
CREATE INDEX "idx_coupon_redemption_coupon_id" ON "coupon_redemption"("coupon_id");

-- CreateIndex
CREATE INDEX "idx_coupon_redemption_learner_id" ON "coupon_redemption"("learner_id");

-- CreateIndex
CREATE INDEX "idx_coupon_redemption_center_id" ON "coupon_redemption"("center_id");

-- CreateIndex
CREATE INDEX "idx_coupon_redemption_expert_id" ON "coupon_redemption"("expert_id");

-- CreateIndex
CREATE INDEX "idx_coupon_redemption_payment_id" ON "coupon_redemption"("payment_id");

-- CreateIndex
CREATE INDEX "notifications_user_type_user_id_idx" ON "notifications"("user_type", "user_id");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "firebase_token_user_id_user_type_idx" ON "firebase_token"("user_id", "user_type");

-- CreateIndex
CREATE INDEX "referral_referral_code_idx" ON "referral"("referral_code");

-- CreateIndex
CREATE INDEX "referral_referrer_type_referrer_id_idx" ON "referral"("referrer_type", "referrer_id");

-- CreateIndex
CREATE INDEX "referral_referee_type_referee_id_idx" ON "referral"("referee_type", "referee_id");

-- CreateIndex
CREATE INDEX "referral_status_idx" ON "referral"("status");

-- AddForeignKey
ALTER TABLE "app_admin_staff" ADD CONSTRAINT "app_admin_staff_reports_to_fkey" FOREIGN KEY ("reports_to") REFERENCES "app_admin_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_admin_staff" ADD CONSTRAINT "app_admin_staff_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "app_admin_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_admin_staff" ADD CONSTRAINT "app_admin_staff_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "app_admin_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_staff" ADD CONSTRAINT "center_staff_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_staff" ADD CONSTRAINT "center_staff_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experts" ADD CONSTRAINT "experts_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experts" ADD CONSTRAINT "experts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experts" ADD CONSTRAINT "experts_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experts" ADD CONSTRAINT "experts_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learners" ADD CONSTRAINT "learners_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learners" ADD CONSTRAINT "learners_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "app_admin_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center" ADD CONSTRAINT "center_center_inquiry_id_fkey" FOREIGN KEY ("center_inquiry_id") REFERENCES "center_inquiries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center" ADD CONSTRAINT "center_center_head_id_fkey" FOREIGN KEY ("center_head_id") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_about_us" ADD CONSTRAINT "center_about_us_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_bank_details" ADD CONSTRAINT "center_bank_details_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_media" ADD CONSTRAINT "center_media_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_verification" ADD CONSTRAINT "center_verification_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_staff_verification" ADD CONSTRAINT "center_staff_verification_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "center_staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_amenities" ADD CONSTRAINT "center_amenities_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_amenities" ADD CONSTRAINT "center_amenities_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "amenities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_services" ADD CONSTRAINT "center_services_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_services" ADD CONSTRAINT "center_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_has_many_staff" ADD CONSTRAINT "center_has_many_staff_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_has_many_staff" ADD CONSTRAINT "center_has_many_staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "center_staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_has_many_experts" ADD CONSTRAINT "center_has_many_experts_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_has_many_experts" ADD CONSTRAINT "center_has_many_experts_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_inquiry_note" ADD CONSTRAINT "center_inquiry_note_center_inquiry_id_fkey" FOREIGN KEY ("center_inquiry_id") REFERENCES "center_inquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "future_proposed_activities" ADD CONSTRAINT "future_proposed_activities_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "future_proposed_activities" ADD CONSTRAINT "future_proposed_activities_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "update_center_details_request" ADD CONSTRAINT "update_center_details_request_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_whatsapp_configs" ADD CONSTRAINT "center_whatsapp_configs_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_about" ADD CONSTRAINT "expert_about_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_media" ADD CONSTRAINT "expert_media_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_kyc_verification" ADD CONSTRAINT "expert_kyc_verification_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_experties" ADD CONSTRAINT "expert_experties_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_experties" ADD CONSTRAINT "expert_experties_experties_id_fkey" FOREIGN KEY ("experties_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_center_interest" ADD CONSTRAINT "expert_center_interest_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_center_interest" ADD CONSTRAINT "expert_center_interest_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_interest_services" ADD CONSTRAINT "expert_interest_services_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "expert_center_interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_interest_services" ADD CONSTRAINT "expert_interest_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_classes" ADD CONSTRAINT "batch_classes_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_classes" ADD CONSTRAINT "batch_classes_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_history" ADD CONSTRAINT "batch_class_history_batch_class_id_fkey" FOREIGN KEY ("batch_class_id") REFERENCES "batch_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_history" ADD CONSTRAINT "batch_class_history_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_history" ADD CONSTRAINT "batch_class_history_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "experts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_history" ADD CONSTRAINT "batch_class_history_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "experts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_enrollments" ADD CONSTRAINT "batch_enrollments_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_enrollments" ADD CONSTRAINT "batch_enrollments_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_attendence" ADD CONSTRAINT "batch_class_attendence_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_attendence" ADD CONSTRAINT "batch_class_attendence_batch_enrollment_id_fkey" FOREIGN KEY ("batch_enrollment_id") REFERENCES "batch_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_attendence" ADD CONSTRAINT "batch_class_attendence_batch_class_id_fkey" FOREIGN KEY ("batch_class_id") REFERENCES "batch_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_attendence" ADD CONSTRAINT "batch_class_attendence_rescheduled_class_id_fkey" FOREIGN KEY ("rescheduled_class_id") REFERENCES "batch_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_attendence" ADD CONSTRAINT "batch_class_attendence_rescheduling_request_id_fkey" FOREIGN KEY ("rescheduling_request_id") REFERENCES "class_reschedule_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_media" ADD CONSTRAINT "batch_media_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_benefits" ADD CONSTRAINT "batch_benefits_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_requests" ADD CONSTRAINT "batch_requests_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_requests" ADD CONSTRAINT "batch_requests_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_requests" ADD CONSTRAINT "batch_requests_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_requests" ADD CONSTRAINT "batch_requests_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_media" ADD CONSTRAINT "batch_class_media_batch_class_id_fkey" FOREIGN KEY ("batch_class_id") REFERENCES "batch_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_media" ADD CONSTRAINT "batch_class_media_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_media_access" ADD CONSTRAINT "batch_class_media_access_batch_class_media_id_fkey" FOREIGN KEY ("batch_class_media_id") REFERENCES "batch_class_media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_class_media_access" ADD CONSTRAINT "batch_class_media_access_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_reschedule_requests" ADD CONSTRAINT "class_reschedule_requests_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_reschedule_requests" ADD CONSTRAINT "class_reschedule_requests_batch_class_id_fkey" FOREIGN KEY ("batch_class_id") REFERENCES "batch_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_polls" ADD CONSTRAINT "reschedule_polls_reschedule_request_id_fkey" FOREIGN KEY ("reschedule_request_id") REFERENCES "class_reschedule_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_polls" ADD CONSTRAINT "reschedule_polls_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_polls" ADD CONSTRAINT "reschedule_polls_batch_class_id_fkey" FOREIGN KEY ("batch_class_id") REFERENCES "batch_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_poll_options" ADD CONSTRAINT "reschedule_poll_options_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "reschedule_polls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_poll_responses" ADD CONSTRAINT "reschedule_poll_responses_poll_option_id_fkey" FOREIGN KEY ("poll_option_id") REFERENCES "reschedule_poll_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reschedule_poll_responses" ADD CONSTRAINT "reschedule_poll_responses_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trial_requests" ADD CONSTRAINT "trial_requests_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trial_requests" ADD CONSTRAINT "trial_requests_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "batch_enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learner_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemption" ADD CONSTRAINT "coupon_redemption_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemption" ADD CONSTRAINT "coupon_redemption_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemption" ADD CONSTRAINT "coupon_redemption_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemption" ADD CONSTRAINT "coupon_redemption_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemption" ADD CONSTRAINT "coupon_redemption_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_refund_requests" ADD CONSTRAINT "enrollment_refund_requests_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "batch_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_refund_requests" ADD CONSTRAINT "enrollment_refund_requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_coupon_code_fkey" FOREIGN KEY ("coupon_code") REFERENCES "coupon"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_signed_by_center_staff_fkey" FOREIGN KEY ("signed_by_center_staff") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_signed_by_expert_fkey" FOREIGN KEY ("signed_by_expert") REFERENCES "experts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_signed_by_learner_fkey" FOREIGN KEY ("signed_by_learner") REFERENCES "learners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_media" ADD CONSTRAINT "learner_media_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profile_kyc_verifications" ADD CONSTRAINT "learner_profile_kyc_verifications_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_has_many_profiles" ADD CONSTRAINT "learner_has_many_profiles_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_has_many_profiles" ADD CONSTRAINT "learner_has_many_profiles_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profile_has_many_centers" ADD CONSTRAINT "learner_profile_has_many_centers_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profile_has_many_centers" ADD CONSTRAINT "learner_profile_has_many_centers_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_center_access_requests" ADD CONSTRAINT "learner_center_access_requests_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_center_access_requests" ADD CONSTRAINT "learner_center_access_requests_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_center_access_requests" ADD CONSTRAINT "learner_center_access_requests_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "center_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learners_interest" ADD CONSTRAINT "learners_interest_learner_profile_id_fkey" FOREIGN KEY ("learner_profile_id") REFERENCES "learner_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learners_interest" ADD CONSTRAINT "learners_interest_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
