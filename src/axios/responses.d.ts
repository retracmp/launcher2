type RError = {
  ok: false;
  error: string;
};

type RSuccess<t> = {
  ok: true;
  data: t;
};

type RResponse<t> = RSuccess<t> | RError;
