import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import dayjs from "dayjs";

function VisitsInfoParcel(props: VisitsInfoParcelProps) {
  const [visit, setVisit] = React.useState(null);
  let response;

  React.useEffect(() => {
    const queryParams = `
      custom:(uuid, startDatetime,visitType:(display))
     
    `.replace(/\s/g, "");

    fetch(
      `/openmrs/ws/rest/v1/visit?v=${queryParams}&patient=${props.patientUuid}`
    )
      .then(resp => {
        if (resp.ok) {
          response = resp.json();
          console.log(response);
          return response;
        } else {
          throw Error(
            `Cannot fetch visit ${props.patientUuid} - server responded with '${resp.status}'`
          );
        }
      })
      .then(visit => {
        setVisit(visit);
      });
  }, []);

  return visit ? renderVisit() : renderLoader();

  function renderLoader() {
    return <div>Loading...</div>;
  }

  function renderVisit() {
    return (
      <table>
        {visit.results.map(v => (
          <div key={v.uuid}>
            <tr>
              <td>
                Visit start date:{" "}
                {v.startDatetime
                  ? dayjs(v.startDatetime).format("YYYY-MMM-DD")
                  : "No start date"}
              </td>
              <td></td>
              <td>Visit type: {v.visitType.display}</td>
            </tr>
          </div>
        ))}
      </table>
    );
  }

  function renderIdentifiers() {
    return visit.identifiers
      .map(
        identifier =>
          `${identifier.identifierType.name}: ${identifier.identifier}`
      )
      .join(" - ");
  }
}

type VisitsInfoParcelProps = {
  visitUuid: string;
  patientUuid: string;
};

export default singleSpaReact({
  React,
  ReactDOM,
  rootComponent: VisitsInfoParcel,
  suppressComponentDidCatchWarning: true
});
