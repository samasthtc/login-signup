import PropTypes from "prop-types";
export default function Modal({
  id,
  title,
  body,
  cancelText,
  confirmText,
  onConfirm,
}) {
  return (
    <div className="modal fade" id={id} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title overflow-auto">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          {body && (
            <div className="modal-body">
              <p>{body}</p>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="btn btn-danger text-semibold"
              onClick={onConfirm}
              data-bs-dismiss="modal"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  body: PropTypes.string,
  id: PropTypes.string,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};
