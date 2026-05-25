import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "contexts/UserContext";
import NoPage from "./NoPage";
import { useMessages } from "contexts/MessagesContext";
import { useApi } from "contexts/ApiContext";
import { useTranslation } from "contexts/TranslationContext";
import { useConfig } from "contexts/ConfigContext";
import { guestEndpoints, staffEndpoints } from "src/api";

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useUser();
  const { addMessage } = useMessages();
  const { get, post, deleteX } = useApi(); // Renamed delete to deleteApi because 'delete' is a reserved keyword
  const { __ } = useTranslation();
  const { getConfig, realm } = useConfig();
  const [displayUser, setDisplayUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [pictureLoading, setPictureLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [anonymizeCheck, setAnonymizeCheck] = useState(null);
  const [anonymizeCheckLoading, setAnonymizeCheckLoading] = useState(false);
  const [anonymizeConfirmed, setAnonymizeConfirmed] = useState(false);
  const [anonymizeLoading, setAnonymizeLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const pictureInputRef = useRef(null);
  const endpoints = realm === 'staff' ? staffEndpoints : guestEndpoints;
  const isGuestRealm = realm === 'guest';
  const profilePictureUrl = getProfilePictureUrl(displayUser?.picture, getConfig('serverURL'));

  useEffect(() => {
    let mounted = true;

    get(endpoints.me)
      .then((response) => {
        if (!mounted) {
          return;
        }
        const user = Array.isArray(response.data) ? response.data[0] : response.data;
        setDisplayUser(user ?? null);
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }
        if (error.response?.status === 401) {
          logout();
          navigate(isGuestRealm ? "/login" : "/admin/login");
          return;
        }
        setDisplayUser(null);
        addMessage("danger", error.response?.data?.error ?? error.statusText ?? __('Unable to load profile'));
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [__, addMessage, endpoints.me, get, isGuestRealm, logout, navigate]);

  const handleDeleteConfirmation = () => {
    deleteX(endpoints.me)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        addMessage("danger", error.statusText ?? __('Error deleting user. Please try again.'));
      });
  };

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedPicture(file);
  };

  const handlePictureUpload = async () => {
    if (!selectedPicture) {
      addMessage("warning", __('Please select a profile picture'));
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedPicture.type)) {
      addMessage("warning", __('Please select a JPG, PNG or WEBP image'));
      return;
    }

    if (selectedPicture.size > 2 * 1024 * 1024) {
      addMessage("warning", __('Profile picture must be 2 MB or smaller'));
      return;
    }

    const formData = new FormData();
    formData.append("picture", selectedPicture);

    setPictureLoading(true);
    try {
      const response = await post(guestEndpoints.profilePicture, formData);
      setDisplayUser(response.data);
      setSelectedPicture(null);
      if (pictureInputRef.current) {
        pictureInputRef.current.value = "";
      }
      addMessage("success", __('Profile picture uploaded'));
    } catch (error) {
      addMessage("danger", getPictureUploadErrorMessage(error, __));
    } finally {
      setPictureLoading(false);
    }
  };

  const handlePictureDelete = async () => {
    setPictureLoading(true);
    try {
      const response = await deleteX(guestEndpoints.profilePicture);
      setDisplayUser(response.data);
      setSelectedPicture(null);
      if (pictureInputRef.current) {
        pictureInputRef.current.value = "";
      }
      addMessage("success", __('Profile picture deleted'));
    } catch (error) {
      addMessage("danger", error.response?.data?.error ?? error.statusText ?? __('Unable to delete profile picture'));
    } finally {
      setPictureLoading(false);
    }
  };

  const handleDataExport = async () => {
    setExportLoading(true);
    try {
      const response = await get(guestEndpoints.dataExport);
      downloadJson(response.data, "guest-data-export.json");
      addMessage("success", __('Data export downloaded'));
    } catch (error) {
      addMessage("danger", error.response?.data?.error ?? error.statusText ?? __('Unable to download data export'));
    } finally {
      setExportLoading(false);
    }
  };

  const handleAnonymizeCheck = async () => {
    setAnonymizeCheckLoading(true);
    setAnonymizeConfirmed(false);
    try {
      const response = await get(guestEndpoints.anonymizeCheck);
      setAnonymizeCheck(response.data);
    } catch (error) {
      addMessage("danger", error.response?.data?.error ?? error.statusText ?? __('Unable to check anonymization'));
    } finally {
      setAnonymizeCheckLoading(false);
    }
  };

  const handleAnonymize = async () => {
    if (!anonymizeCheck?.can_anonymize || !anonymizeConfirmed) {
      return;
    }

    setAnonymizeLoading(true);
    try {
      await post(guestEndpoints.anonymize, { confirm: true });
      addMessage("success", __('Account anonymized'));
      logout();
      navigate("/");
    } catch (error) {
      if (error.response?.status === 409 && error.response.data) {
        setAnonymizeCheck(error.response.data);
      }
      addMessage("danger", error.response?.data?.error ?? error.response?.data?.message ?? error.statusText ?? __('Unable to anonymize account'));
    } finally {
      setAnonymizeLoading(false);
    }
  };

  return (
    <div className="container">
      {loading ? (
        <div>{__('Please wait')}</div>
      ) : !displayUser ? (
        <NoPage />
      ) : (
        <div>
          <h2>{displayUser.name}</h2>
          <div className="row">
            <div className="col-md-6">
              <UserInfo label={__('First Name')} value={displayUser.first_name}  />
              <UserInfo label={__('Middle Name')} value={displayUser.middle_name} />
              <UserInfo label={__('Last Name')} value={displayUser.last_name} />
              <UserInfo label={__('Email')} value={displayUser.email} />
              {isGuestRealm && (
                <>
                  <UserInfo label={__('Address')} value={displayUser.address} />
                  <UserInfo label={__('Phone number')} value={displayUser.phone} />
                  <UserInfo label={__('Birth date')} value={displayUser.birth_date} />
                  <UserInfo label={__('Table')} value={displayUser.table} />
                </>
              )}
              {realm === 'staff' && <UserInfo label={__('Role')} value={displayUser.role} />}
            </div>
          </div>
          {isGuestRealm && (
            <div className="row">
              <div className="col-md-6">
                <h3>{__('Compliance')}</h3>
                <UserInfo label={__('18+ confirmed')} value={displayUser.is_over_18 ? __('Yes') : __('No')} />
                <UserInfo label={__('Age verified at')} value={displayUser.age_verified_at} />
                {displayUser.anonymized_at && (
                  <UserInfo label={__('Anonymized at')} value={displayUser.anonymized_at} />
                )}
                <UserInfo label={__('Profile picture')} value={displayUser.picture ? __('Uploaded') : __('Not uploaded')} />
                {profilePictureUrl && (
                  <div className="mb-3">
                    <img
                      alt={__('Profile picture')}
                      className="img-thumbnail"
                      src={profilePictureUrl}
                      style={{ maxHeight: "160px", maxWidth: "160px", objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label" htmlFor="profilePicture">
                    {__('Choose profile picture')}
                  </label>
                  <input
                    accept="image/jpeg,image/png,image/webp"
                    className="form-control"
                    disabled={pictureLoading}
                    id="profilePicture"
                    onChange={handlePictureChange}
                    ref={pictureInputRef}
                    type="file"
                  />
                </div>
                <button
                  className="btn btn-primary me-2"
                  disabled={!selectedPicture || pictureLoading}
                  onClick={handlePictureUpload}
                  type="button"
                >
                  {__('Upload picture')}
                </button>
                {displayUser.picture && (
                  <button
                    className="btn btn-outline-danger"
                    disabled={pictureLoading}
                    onClick={handlePictureDelete}
                    type="button"
                  >
                    {__('Delete picture')}
                  </button>
                )}
                <div className="mt-3">
                  <button
                    className="btn btn-outline-primary"
                    disabled={exportLoading}
                    onClick={handleDataExport}
                    type="button"
                  >
                    {__('Download my data')}
                  </button>
                </div>
                <div className="mt-3">
                  <button
                    className="btn btn-outline-secondary"
                    disabled={anonymizeCheckLoading || anonymizeLoading}
                    onClick={handleAnonymizeCheck}
                    type="button"
                  >
                    {__('Check anonymization')}
                  </button>
                </div>
                {anonymizeCheck && (
                  <div className="mt-3">
                    {anonymizeCheck.can_anonymize ? (
                      <p>{__('Your account can be anonymized.')}</p>
                    ) : (
                      <>
                        <p>{__('Your account cannot be anonymized yet.')}</p>
                        <ul>
                          {(anonymizeCheck.blocking_reasons ?? []).map((reason) => (
                            <li key={reason.code ?? reason.message}>{reason.message}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    <div className="form-check">
                      <input
                        checked={anonymizeConfirmed}
                        className="form-check-input"
                        disabled={!anonymizeCheck.can_anonymize || anonymizeLoading}
                        id="anonymizeConfirmed"
                        onChange={(event) => setAnonymizeConfirmed(event.target.checked)}
                        type="checkbox"
                      />
                      <label className="form-check-label" htmlFor="anonymizeConfirmed">
                        {__('I understand this cannot be undone')}
                      </label>
                    </div>
                    <button
                      className="btn btn-danger mt-2"
                      disabled={!anonymizeCheck.can_anonymize || !anonymizeConfirmed || anonymizeLoading}
                      onClick={handleAnonymize}
                      type="button"
                    >
                      {__('Anonymize my account')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <button className="btn btn-danger mt-3" onClick={() => setShowDeleteModal(true)}>
            {__('Delete my account')}
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{__('Confirm Deletion')}</h5>
              </div>
              <div className="modal-body">
                <p>{__('Are you sure you want to delete your account? This action cannot be undone.')}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  {__('Cancel')}
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirmation}>
                  {__('Delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserInfo = ({ label, value }) => {
  return (
    <div className="mb-3">
      <strong>{label}: </strong>
      {value}
    </div>
  );
};

const getPictureUploadErrorMessage = (error, __) => {
  if (error.response?.status === 413) {
    return __('Profile picture must be 2 MB or smaller');
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.message === 'Network Error') {
    return __('Unable to upload profile picture. Please try a smaller image.');
  }

  return error.statusText ?? __('Unable to upload profile picture');
};

const getProfilePictureUrl = (picture, serverUrl) => {
  if (!picture) {
    return null;
  }

  if (/^https?:\/\//i.test(picture)) {
    return picture;
  }

  try {
    const origin = new URL(serverUrl).origin;
    const picturePath = picture.startsWith('/') ? picture : `/storage/${picture}`;
    return `${origin}${picturePath}`;
  } catch {
    return picture;
  }
};

const downloadJson = (data, fileName) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default Profile;
