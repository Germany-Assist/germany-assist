import { sequelize } from "../../configs/database.js";
import db from "../../database/index.js";
import bcryptUtil from "../../utils/bcrypt.util.js";
import { AppError } from "../../utils/error.class.js";
import userRepository from "../user/user.repository.js";
import serviceProviderRepository from "./serviceProvider.repository .js";
import authServices from "../auth/auth.service.js";
import userDomain from "../user/user.domain.js";
import permissionServices from "../permission/permission.services.js";
import { roleTemplates } from "../../database/templates.js";
import jwtUtils from "../../middlewares/jwt.middleware.js";
import userMapper from "../user/user.mapper.js";
import AssetService from "../../services/assts.services.js";
import verificationRequestRepository from "../verificationRequests/verificationRequest.repository.js";
import { PROVIDER_TYPES } from "../../configs/constants.js";
import hashIdUtil from "../../utils/hashId.util.js";

const getFile = (files, field) => files?.[field]?.[0] || null;

const MAX_CATEGORIES = 1;
const MAX_FILES_PER_CATEGORY = 10;

// Helper to process category files - parses categoryEntries and maps files to categories
// categoryEntries: [{"categoryId": "german_language", "fileIndices": [0, 1]}, ...]
// files: array of uploaded files from req.files?.categoryFiles
const processCategoryFiles = (body, files) => {
  const categoryFilesMap = {};

  if (!body.categoryEntries || !files || files.length === 0) {
    return categoryFilesMap;
  }

  try {
    const categoryEntries = JSON.parse(body.categoryEntries);

    if (categoryEntries.length > MAX_CATEGORIES) {
      throw new AppError(
        400,
        `Only ${MAX_CATEGORIES} category is allowed`,
        true,
      );
    }

    categoryEntries.forEach(({ categoryId, fileIndices }) => {
      if (fileIndices.length > MAX_FILES_PER_CATEGORY) {
        throw new AppError(
          400,
          `Maximum ${MAX_FILES_PER_CATEGORY} files allowed per category`,
          true,
        );
      }
      categoryFilesMap[categoryId] = fileIndices
        .filter((idx) => files[idx])
        .map((idx) => files[idx]);
    });
  } catch (e) {
    if (e instanceof AppError) throw e;
    console.error("Error parsing categoryEntries:", e);
  }

  return categoryFilesMap;
};

export const registerFreelancer = async (body, files) => {
  const t = await sequelize.transaction();
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      nationality,
      countryOfResidence,
      about,
    } = body;

    const userExists = await userRepository.getUserByEmail(email);
    if (userExists) {
      throw new AppError(
        409,
        "User already exists",
        false,
        "Email already in use",
      );
    }

    const spData = {
      name: firstName + " " + lastName,
      about: about || "",
      phoneNumber: phone,
      email,
      type: PROVIDER_TYPES.freelancer, //"freelancer",
    };

    const sp = await serviceProviderRepository.createServiceProvider(spData, t);
    const hashedPassword = bcryptUtil.hashPassword(password);
    const domain = userDomain.setRoleAndType("serviceProvider");
    const { rootRole, rootRelatedType } = domain;

    const user = await userRepository.createUser(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isVerified: false,
        UserRole: {
          role: rootRole,
          relatedType: rootRelatedType,
          relatedId: sp.id,
        },
        UserProfile: {
          nationality,
          countryOfResidence,
          phoneNumber: phone,
        },
      },
      t,
    );
    await permissionServices.initPermissions(
      user.id,
      roleTemplates[rootRole],
      t,
    );

    const profileImage = getFile(files, "profileImage");
    const profileImageUrl = body.profileImageUrl;
    if (profileImage) {
      await AssetService.uploadAsset({
        files: [profileImage],
        ownerId: user.id,
        typeKey: "userImage",
        userId: user.id,
        transaction: t,
      });
    } else if (profileImageUrl) {
      await AssetService.createAssetFromUrl({
        url: profileImageUrl,
        ownerId: user.id,
        typeKey: "userImage",
        userId: user.id,
        transaction: t,
      });
    }

    const idDocument = getFile(files, "idDocument");
    if (idDocument) {
      const request = await verificationRequestRepository.createRequest(
        {
          userId: user.id,
          serviceProviderId: sp.id,
          type: "identity",
          relatedId: sp.id,
        },
        t,
      );
      await AssetService.uploadAsset({
        files: [idDocument],
        ownerId: request.id,
        typeKey:
          idDocument.mimetype === "application/pdf"
            ? "verificationDocument"
            : "verificationImage",
        label: "Identity Document",
        userId: user.id,
        transaction: t,
      });
    }

    // Process category credential files
    // categoryEntries tells us which file indices belong to which category
    const categoryFiles = files?.categoryFiles || [];
    const categoryFilesMap = processCategoryFiles(body, categoryFiles);

    // For each category, create a verification request and upload the files
    for (const [categoryId, catFiles] of Object.entries(categoryFilesMap)) {
      if (catFiles && catFiles.length > 0) {
        const categoryRequest =
          await verificationRequestRepository.createRequest(
            {
              userId: user.id,
              serviceProviderId: sp.id,
              type: "category",
              relatedId: hashIdUtil.hashIdDecode(categoryId),
            },
            t,
          );
        await AssetService.uploadAsset({
          files: catFiles,
          ownerId: categoryRequest.id,
          typeKey: "verificationDocument",
          label: `Category: ${hashIdUtil.hashIdDecode(categoryId)}`,
          userId: user.id,
          transaction: t,
        });
      }
    }

    const { accessToken, refreshToken } = jwtUtils.generateTokens(user);
    const sanitizedUser = await userMapper.sanitizeUser(user);

    await t.commit();
    await authServices.sendVerificationEmail(email, user.id);

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const registerCompany = async (body, files) => {
  const t = await sequelize.transaction();
  try {
    const {
      firstName,
      lastName,
      companyName,
      email,
      phone,
      password,
      nationality,
      countryOfResidence,
      about,
    } = body;

    const userExists = await userRepository.getUserByEmail(email);
    if (userExists) {
      throw new AppError(
        409,
        "User already exists",
        false,
        "Email already in use",
      );
    }

    const spData = {
      name: companyName,
      about: about || "",
      phoneNumber: phone,
      email,
      type: PROVIDER_TYPES.company, //"company",
    };

    const sp = await serviceProviderRepository.createServiceProvider(spData, t);
    const hashedPassword = bcryptUtil.hashPassword(password);
    // TODO replace with the constants created
    const domain = userDomain.setRoleAndType("serviceProvider");
    const { rootRole, rootRelatedType } = domain;

    const user = await userRepository.createUser(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isVerified: false,
        UserRole: {
          role: rootRole,
          relatedType: rootRelatedType,
          relatedId: sp.id,
        },
        UserProfile: {
          nationality,
          countryOfResidence,
          phoneNumber: phone,
        },
      },
      t,
    );

    await permissionServices.initPermissions(
      user.id,
      roleTemplates[rootRole],
      t,
    );

    const profileImage = getFile(files, "profileImage");
    const profileImageUrl = body.profileImageUrl;
    if (profileImage) {
      await AssetService.uploadAsset({
        files: [profileImage],
        ownerId: user.id,
        typeKey: "userImage",
        userId: user.id,
        transaction: t,
      });
    } else if (profileImageUrl) {
      await AssetService.createAssetFromUrl({
        url: profileImageUrl,
        ownerId: user.id,
        typeKey: "userImage",
        userId: user.id,
        transaction: t,
      });
    }
    const idDocument = getFile(files, "idDocument");
    const proofOfResidence = getFile(files, "proofOfResidence");
    const businessRegistration = getFile(files, "businessRegistration");
    if (idDocument || proofOfResidence || businessRegistration) {
      const request = await verificationRequestRepository.createRequest(
        {
          userId: user.id,
          serviceProviderId: sp.id,
          type: "identity",
          relatedId: sp.id,
        },
        t,
      );

      if (idDocument) {
        await AssetService.uploadAsset({
          files: [idDocument],
          ownerId: request.id,
          typeKey:
            idDocument.mimetype === "application/pdf"
              ? "verificationDocument"
              : "verificationImage",
          userId: user.id,
          label: "Identity Document",
          transaction: t,
        });
      }
      if (proofOfResidence) {
        await AssetService.uploadAsset({
          files: [proofOfResidence],
          ownerId: request.id,
          typeKey:
            proofOfResidence.mimetype === "application/pdf"
              ? "verificationDocument"
              : "verificationImage",
          userId: user.id,
          label: "proofOfResidence",
          transaction: t,
        });
      }
      if (businessRegistration) {
        await AssetService.uploadAsset({
          files: [businessRegistration],
          ownerId: request.id,
          typeKey:
            businessRegistration.mimetype === "application/pdf"
              ? "verificationDocument"
              : "verificationImage",
          userId: user.id,
          label: "businessRegistration",
          transaction: t,
        });
      }
    }

    // Process category credential files
    // categoryEntries tells us which file indices belong to which category
    const categoryFiles = files?.categoryFiles || [];
    const categoryFilesMap = processCategoryFiles(body, categoryFiles);

    // For each category, create a verification request and upload the files
    for (const [categoryId, catFiles] of Object.entries(categoryFilesMap)) {
      if (catFiles && catFiles.length > 0) {
        const categoryRequest =
          await verificationRequestRepository.createRequest(
            {
              userId: user.id,
              serviceProviderId: sp.id,
              type: "category",
              relatedId: hashIdUtil.hashIdDecode(categoryId),
            },
            t,
          );
        await AssetService.uploadAsset({
          files: catFiles,
          ownerId: categoryRequest.id,
          typeKey: "verificationDocument",
          label: `Category: ${hashIdUtil.hashIdDecode(categoryId)}`,
          userId: user.id,
          transaction: t,
        });
      }
    }

    const { accessToken, refreshToken } = jwtUtils.generateTokens(user);
    const sanitizedUser = await userMapper.sanitizeUser(user);

    await t.commit();
    await authServices.sendVerificationEmail(email, user.id);

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const getAllServiceProvider = async () => {
  return await db.ServiceProvider.findAll({
    attributes: [
      "id",
      "name",
      "about",
      "description",
      "phoneNumber",
      "image",
      "isVerified",
      "totalReviews",
      "rating",
      "email",
      "views",
    ],
  });
};

export const getServiceProviderById = async (id) => {
  const profile = await db.ServiceProvider.findByPk(id, {
    attributes: [
      "id",
      "name",
      "about",
      "description",
      "phoneNumber",
      "image",
      "isVerified",
      "totalReviews",
      "rating",
      "email",
      "views",
    ],
    include: [
      {
        model: db.Service,
        attributes: ["id", "title", "rating"],
        required: false,
        where: { published: true, approved: true, rejected: false },
        include: [
          { model: db.Asset, attributes: ["url"], as: "profileImages" },
        ],
      },
    ],
  });
  if (!profile)
    throw new AppError(
      404,
      "Service Provider not found",
      true,
      "Service Provider not found",
    );
  profile.increment("views");
  await profile.save();
  return profile.toJSON();
};

export const updateServiceProvider = async (id, updateData) => {
  const [count, [profile]] = await db.ServiceProvider.update(updateData, {
    where: { id },
    returning: true,
  });
  if (count === 0) throw new AppError(404, "Service Provider not found", true);
  return profile;
};

export const deleteServiceProvider = async (id) => {
  const profile = await db.ServiceProvider.findByPk(id);
  if (!profile)
    throw new AppError(
      404,
      "Service Provider not found",
      true,
      "Service Provider not found",
    );
  await profile.destroy();
  return { id, message: "Service Provider deleted" };
};
export const restoreServiceProvider = async (id) => {
  const profile = await db.ServiceProvider.findOne({
    where: { id },
    paranoid: false,
  });
  if (!profile)
    throw new AppError(
      404,
      "Service Provider not found",
      true,
      "Service Provider not found",
    );
  if (!profile.deletedAt)
    throw new AppError(
      400,
      "Service Provider is not deleted",
      true,
      "Service Provider is not deleted",
    );
  await profile.restore();
  return profile;
};

export const updateServiceProviderRating = async (id, newRating) => {
  if (typeof newRating !== "number" || newRating < 0 || newRating > 5) {
    throw new AppError(400, "Invalid rating value", true);
  }
  const profile = await db.ServiceProvider.findByPk(id);
  if (!profile)
    throw new AppError(404, "Business not found", true, "Business not found");
  const currentTotalReviews = profile.totalReviews || 0;
  const currentRating = profile.rating || 0;
  const updatedTotalReviews = currentTotalReviews + 1;
  const updatedRating =
    (currentRating * currentTotalReviews + newRating) / updatedTotalReviews;
  return await profile.update({
    rating: updatedRating,
    totalReviews: updatedTotalReviews,
  });
};
const serviceProviderService = {
  getAllServiceProvider,
  getServiceProviderById,
  updateServiceProvider,
  deleteServiceProvider,
  restoreServiceProvider,
  updateServiceProviderRating,
  registerFreelancer,
  registerCompany,
};

export default serviceProviderService;
